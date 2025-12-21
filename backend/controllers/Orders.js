const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");
const Product = require("../models/products");

const postUserOrders = async (req, res) => {
  const { orderDetails } = req.body;
  const { products } = orderDetails;

  const email = req.body?.orderDetails?.email?.toLowerCase();

  let isOrderAboveLimit;
  for (let key of products) {
    const findProducts = await Product.findById(key.productId);
    
    // Check main stock first (default assumption)
    let productStock = findProducts.stock;
    
    // If a specific color variant is selected, check that variant's stock
    if (key.selectedColor && key.selectedColor.colorName && findProducts.colorVariants && findProducts.colorVariants.length > 0) {
        const variant = findProducts.colorVariants.find(c => c.colorName === key.selectedColor.colorName);
        if (variant) {
            productStock = variant.stock;
        } else {
            productStock = 0; // Selected variant not found
        }
    }

    if (key.quantity > productStock) {
      isOrderAboveLimit = true;
    }
  }

  let checkIfEmailExists = await User.findOne({ email });
  if (!checkIfEmailExists) {
    throw new CustomErrorHandler(403, "Email address associated with the account must be used ");
  } else if (isOrderAboveLimit) {
    throw new CustomErrorHandler(403, "One or more product quantities selected is more than the amount in stock");
  } else {
    const updatedUser = await User.findOneAndUpdate({ email }, { $push: { orders: orderDetails } }, { new: true });

    for (let key of products) {
      const findProduct = await Product.findById(key.productId);
      
      // Check if a specific color variant was selected
      if (key.selectedColor && key.selectedColor.colorName && findProduct.colorVariants && findProduct.colorVariants.length > 0) {
          // Update variant stock
          const variantIndex = findProduct.colorVariants.findIndex(c => c.colorName === key.selectedColor.colorName);
          if (variantIndex !== -1) {
              findProduct.colorVariants[variantIndex].stock -= key.quantity;
              await findProduct.save(); 
          }
      } else {
           // Fallback to main stock (Standard product OR Customizable product bought as default)
          let newStock = findProduct.stock - key.quantity;
          await findProduct.updateOne({ stock: newStock });
      }
    }

    res.status(201).json({ message: "order sucessful", user: updatedUser });
  }
};

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const users = await User.find({}).select('orders username email').populate('orders.products.productId', 'title price image');
    
    // Flatten all orders from all users
    let allOrders = [];
    users.forEach(user => {
      user.orders.forEach(order => {
        // Get first product for display
        const firstProduct = order.products[0]?.productId;
        allOrders.push({
          id: order._id,
          customer: order.username,
          email: user.email,
          phone: user.phone || 'N/A',
          product: firstProduct?.title || 'Multiple Products',
          productCount: order.products.length,
          amount: order.totalAmount,
          status: order.deliveryStatus === 'delivered' ? 'Delivered' : 
                  order.deliveryStatus === 'cancelled' ? 'Cancelled' : 
                  'Processing',
          paymentStatus: order.paymentStatus,
          date: new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          rawDate: order.date,
          address: order.address,
          city: order.city,
          country: order.country,
          postalCode: order.postalCode,
          shippingMethod: order.shippingMethod,
          products: order.products,
          tracking: order.tracking // Include tracking info
        });
      });
    });

    // Sort by date (newest first)
    allOrders.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate));

    res.status(200).json({ 
      success: true, 
      orders: allOrders,
      totalOrders: allOrders.length 
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password -verificationToken');
    
    const usersData = users.map(user => ({
      id: user._id,
      name: user.username,
      email: user.email,
      phone: user.phone || 'N/A',
      orders: user.orders.length,
      spent: user.orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
      joined: new Date(user.createdAt || Date.now()).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }),
      status: user.verificationStatus === 'verified' ? 'Verified' : 'Pending',
      adminStatus: user.adminStatus,
      address: user.address,
      city: user.city,
      country: user.country
    }));

    res.status(200).json({ 
      success: true, 
      users: usersData,
      totalUsers: usersData.length,
      verifiedUsers: usersData.filter(u => u.status === 'Verified').length
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Get single user details (Admin only)
const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomErrorHandler(400, "User ID is required");
    }

    const user = await User.findById(id).select('-password -verificationToken');

    if (!user) {
      throw new CustomErrorHandler(404, "User not found");
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        verificationStatus: user.verificationStatus,
        adminStatus: user.adminStatus,
        orders: user.orders,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      throw new CustomErrorHandler(400, "User ID is required");
    }

    // Don't allow password update through this endpoint
    if (updates.password) {
      delete updates.password;
    }

    // Email should be lowercase
    if (updates.email) {
      updates.email = updates.email.toLowerCase();
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -verificationToken');

    if (!updatedUser) {
      throw new CustomErrorHandler(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Update user verification status (Admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { verificationStatus } = req.body;

    if (!id) {
      throw new CustomErrorHandler(400, "User ID is required");
    }

    if (!['pending', 'verified'].includes(verificationStatus)) {
      throw new CustomErrorHandler(400, "Invalid verification status");
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { verificationStatus },
      { new: true }
    ).select('-password -verificationToken');

    if (!updatedUser) {
      throw new CustomErrorHandler(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${verificationStatus}`,
      user: updatedUser
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomErrorHandler(400, "User ID is required");
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      throw new CustomErrorHandler(404, "User not found");
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    throw new CustomErrorHandler(500, error.message);
  }
};

// Update Order Tracking (Admin only)
const updateOrderTracking = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { carrier, trackingId } = req.body;

    if (!orderId || !carrier || !trackingId) {
      throw new CustomErrorHandler(400, "Missing required fields");
    }

    // Find the user who has this order
    const user = await User.findOne({ "orders._id": orderId });

    if (!user) {
      throw new CustomErrorHandler(404, "Order not found");
    }

    // Find the specific order index
    const orderIndex = user.orders.findIndex(ord => ord._id.toString() === orderId);

    if (orderIndex === -1) {
       throw new CustomErrorHandler(404, "Order not found in user record");
    }

    // Generate Tracking URL
    const trackingProviders = {
      SPEEDPOST: {
        type: "DIRECT",
        url: "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx?trackid="
      },
      DHL: {
        type: "DIRECT",
        url: "https://www.dhl.com/in-en/home/tracking.html?tracking-id="
      },
      BLUEDART: {
        type: "DIRECT",
        url: "https://www.bluedart.com/web/guest/trackdartresult?trackFor=0&trackNo="
      },
      SPEEDEX: {
        type: "LANDING",
        url: "https://spdexp.com/"
      }
    };

    const provider = trackingProviders[carrier];
    
    // Fallback if carrier not in list (though validation normally prevents this)
    if (!provider) {
       throw new CustomErrorHandler(400, "Invalid Carrier Selected");
    }

    let trackingUrl;
    if (provider.type === "DIRECT") {
      trackingUrl = provider.url + trackingId;
    } else {
      trackingUrl = provider.url; // NO trackingId appended
    }

    // Update order fields
    user.orders[orderIndex].tracking = {
        carrier,
        trackingId,
        trackingUrl
    };
    user.orders[orderIndex].deliveryStatus = "Shipped"; // Update status to Shipped

    await user.save();

    res.status(200).json({
      success: true,
      message: "Tracking details updated successfully",
      trackingUrl
    });

  } catch (error) {
     throw new CustomErrorHandler(500, error.message);
  }
};

module.exports = { postUserOrders, getAllOrders, getAllUsers, getSingleUser, updateUser, updateUserStatus, deleteUser, updateOrderTracking };
