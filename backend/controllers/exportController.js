const ExcelJS = require('exceljs');
const User = require('../models/userData');
const CustomErrorHandler = require('../errors/customErrorHandler');

const getStartOfPeriod = (period) => {
    const now = new Date();
    const start = new Date(now);
    
    if (period === 'today') {
        start.setHours(0, 0, 0, 0);
    } else if (period === 'week') {
        const day = start.getDay() || 7; // Get current day number, Sunday is 0 -> 7
        if (day !== 1) start.setHours(-24 * (day - 1)); 
        start.setHours(0, 0, 0, 0);
    } else if (period === 'month') {
        start.setDate(1);
        start.setHours(0, 0, 0, 0);
    } else if (period === 'custom') {
        // Handle custom ranges if passed (simplified for now)
        return null; 
    }
    return start;
};

const generateExcel = async (orders, res, filename) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Orders');

    worksheet.columns = [
        { header: 'Order ID', key: 'orderId', width: 25 },
        { header: 'Order Date', key: 'date', width: 15 },
        { header: 'Customer Name', key: 'customer', width: 20 },
        { header: 'Email', key: 'email', width: 25 },
        { header: 'Phone', key: 'phone', width: 15 },
        { header: 'Product Name', key: 'product', width: 30 },
        { header: 'Wood Type', key: 'wood', width: 15 },
        { header: 'Primary Color', key: 'primaryColor', width: 15 },
        { header: 'Secondary Color', key: 'secondaryColor', width: 15 },
        { header: 'Quantity', key: 'quantity', width: 10 },
        { header: 'Price (Each)', key: 'price', width: 12 },
        { header: 'Total Amount', key: 'total', width: 12 },
        { header: 'Payment Method', key: 'payment', width: 15 },
        { header: 'Payment Status', key: 'paymentStatus', width: 15 },
        { header: 'Order Status', key: 'status', width: 15 },
        { header: 'Shipping Address', key: 'address', width: 40 }
    ];

    // Style Header
    worksheet.getRow(1).font = { bold: true };

    orders.forEach(order => {
        order.products.forEach(item => {
            // Wood Logic
            let woodType = "N/A";
            if (item.wood && item.wood.type && item.wood.type !== "Not Selected") {
                woodType = item.wood.type;
            } else if (item.woodType && item.woodType !== "Not Selected") {
                woodType = item.woodType.name || item.woodType;
            }

            // Color Logic
            let primaryColor = "";
            let secondaryColor = "";
            
            if (item.customization && item.customization.enabled) {
                primaryColor = item.customization.primaryColor || "";
                secondaryColor = item.customization.secondaryColor || "";
            } else if (item.selectedColor) {
                 primaryColor = item.selectedColor.primaryColorName || item.selectedColor.name || "";
                 secondaryColor = item.selectedColor.secondaryColorName || "";
            }

            worksheet.addRow({
                orderId: order._id.toString(),
                date: new Date(order.date).toLocaleDateString(),
                customer: order.username || order.customerName || 'Guest',
                email: order.email,
                phone: order.phone || 'N/A',
                product: item.name || item.title || 'Unknown Product',
                wood: woodType,
                primaryColor: primaryColor,
                secondaryColor: secondaryColor,
                quantity: item.quantity,
                price: item.wood?.price || item.woodPrice || item.price,
                total: order.totalAmount, // Order total, not line total
                payment: order.payment?.method || 'N/A',
                paymentStatus: order.paymentStatus || order.payment?.status,
                status: order.deliveryStatus,
                address: `${order.addressLine1 || ''} ${order.addressLine2 || ''}, ${order.city || ''}, ${order.state || ''} - ${order.postalCode || ''}, ${order.country || ''}`.replace(/,\s*,/g, ',').trim()
            });
        });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
};

const exportOrders = async (req, res) => {
    try {
        const { range } = req.params; // 'all', 'today', 'week', 'month'
        
        let query = {};
        
        if (range !== 'all') {
            const start = getStartOfPeriod(range);
            if (start) {
                // We need to filter users who have orders since `start` date
                // But simplified: 
                // Strategy: Find users where orders.date >= start
                // Then filter the orders array in memory or aggregation
                
                // Aggregation is cleaner but let's stick to find logic we know works
            }
        }

        // Fetch All users for simplicity first, then filter orders
        // (Optimization: In a real large DB, use aggregation $unwind $match)
        const users = await User.find({}).select('orders username email phone');
        
        let allOrders = [];
        const start = range !== 'all' ? getStartOfPeriod(range) : null;

        users.forEach(user => {
            if (user.orders) {
                user.orders.forEach(order => {
                     const orderDate = new Date(order.date);
                     if (!start || orderDate >= start) {
                         // Add user details to order object for flattening
                         const enrichedOrder = order.toObject();
                         enrichedOrder.username = user.username;
                         enrichedOrder.email = user.email;
                         enrichedOrder.phone = enrichedOrder.phone || user.phone; // Order phone overrides user phone logic
                         allOrders.push(enrichedOrder);
                     }
                });
            }
        });
        
        // Sort by Date Desc
        allOrders.sort((a,b) => new Date(b.date) - new Date(a.date));

        const filename = `orders_${range}_${new Date().toISOString().split('T')[0]}`;
        await generateExcel(allOrders, res, filename);

    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

const exportOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ "orders._id": id });
        
        if (!user) {
            throw new CustomErrorHandler(404, "Order not found");
        }
        
        const order = user.orders.find(o => o._id.toString() === id);
        if (!order) {
            throw new CustomErrorHandler(404, "Order not found");
        }

        const enrichedOrder = order.toObject();
        enrichedOrder.username = user.username;
        enrichedOrder.email = user.email;
        enrichedOrder.phone = enrichedOrder.phone || user.phone;

        const filename = `order_${id}`;
        await generateExcel([enrichedOrder], res, filename);

    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

module.exports = { exportOrders, exportOrderById };
