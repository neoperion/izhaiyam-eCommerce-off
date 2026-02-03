const ExcelJS = require('exceljs');
const Order = require('../models/orderModel'); // Use standalone Order model

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
        { header: 'Shipping Address', key: 'address', width: 40 },
        { header: 'Source', key: 'source', width: 10 }
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
            let primaryColor = "N/A";
            let secondaryColor = "N/A";
            
            if (item.customization && item.customization.enabled) {
                primaryColor = item.customization.primaryColor || "";
                secondaryColor = item.customization.secondaryColor || "";
            } else if (item.selectedColor) {
                 primaryColor = item.selectedColor.primaryColorName || item.selectedColor.name || "";
                 secondaryColor = item.selectedColor.secondaryColorName || "";
            }

            worksheet.addRow({
                orderId: order._id.toString(),
                date: new Date(order.date || order.createdAt).toLocaleDateString(),
                customer: order.username || order.customerName || 'Guest',
                email: order.email || 'N/A',
                phone: order.phone || 'N/A',
                product: item.name || item.title || 'Unknown Product',
                wood: woodType,
                primaryColor: primaryColor,
                secondaryColor: secondaryColor,
                quantity: item.quantity,
                price: item.price || 0,
                total: order.totalAmount, 
                payment: order.payment?.method || 'N/A',
                paymentStatus: order.paymentStatus || order.payment?.status || 'N/A',
                status: order.deliveryStatus || 'N/A',
                address: `${order.addressLine1 || order.address || ''} ${order.addressLine2 || ''}, ${order.city || ''}, ${order.state || ''} - ${order.postalCode || ''}, ${order.country || ''}`.replace(/,\s*,/g, ',').trim(),
                source: order.orderSource || 'online'
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
                query.date = { $gte: start };
            }
        }

        const orders = await Order.find(query).sort({ date: -1 });
        const filename = `orders_${range}_${new Date().toISOString().split('T')[0]}`;
        await generateExcel(orders, res, filename);

    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

const exportOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);
        
        if (!order) {
            throw new CustomErrorHandler(404, "Order not found");
        }

        const filename = `order_${id}`;
        await generateExcel([order], res, filename);

    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

module.exports = { exportOrders, exportOrderById };
