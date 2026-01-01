const mongoose = require("mongoose");
const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");
const Product = require("../models/products");

const postUserOrders = async (req, res) => {
  const { orderDetails } = req.body;
  const { products } = orderDetails;
  const email = req.body?.orderDetails?.email?.toLowerCase();

  const session = await mongoose.startSession().catch(() => null);

  try {
    if (session) {
      session.startTransaction();
    }

    // 1. Deduct Stock Atomically & Build Snapshot
    const formattedProducts = [];

    for (let item of products) {
      let product;
      let snapshot = {
          productId: item.productId,
          quantity: item.quantity
      };

      // OPTION A: Specific Color Variant
      if (item.selectedColor && (item.selectedColor.primaryColorName || item.selectedColor.colorName)) {
        // Find specific variant with enough stock (support both new and legacy fields)
        const colorField = item.selectedColor.primaryColorName ? "primaryColorName" : "colorName";
        const colorValue = item.selectedColor.primaryColorName || item.selectedColor.colorName;
        
        product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            "colorVariants": {
              $elemMatch: {
                [colorField]: colorValue,
                stock: { $gte: item.quantity }
              }
            }
          },
          {
            $inc: { "colorVariants.$.stock": -item.quantity }
          },
          { new: true, session }
        );

        // Add Snapshot Data for Variant
         if(product) {
             snapshot.name = product.title;
             snapshot.price = product.price;
             snapshot.image = product.image; // Fallback main image
             
             // Variant Details
             snapshot.selectedColor = {
                primaryColorName: item.selectedColor.primaryColorName,
                primaryHexCode: item.selectedColor.primaryHexCode,
                secondaryColorName: item.selectedColor.secondaryColorName,
                secondaryHexCode: item.selectedColor.secondaryHexCode,
                isDualColor: item.selectedColor.isDualColor || false,
                imageUrl: item.selectedColor.imageUrl, // Priority image
                name: item.selectedColor.colorName || item.selectedColor.primaryColorName,
                hexCode: item.selectedColor.hexCode || item.selectedColor.primaryHexCode
             };
         }

      } else {
        // OPTION B: Main Product Stock
        product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity }
          },
          {
            $inc: { stock: -item.quantity }
          },
          { new: true, session }
        );
        
        // Add Snapshot Data for Main Product
        if(product) {
            snapshot.name = product.title;
            snapshot.price = product.price;
            snapshot.image = product.image;
        }
      }

      if (!product) {
        throw new CustomErrorHandler(400, `Product/Variant out of stock: ${item.name || item.productId}`);
      }

      formattedProducts.push(snapshot);

      // 2. Update Status if Stock hits 0
      let needsSave = false;
      if (item.selectedColor && item.selectedColor.colorName) {
        // Variant Logic
      } else {
        if (product.stock === 0) {
          product.status = "Out of Stock";
          needsSave = true;
        } else if (product.status === "Out of Stock" && product.stock > 0) {
          product.status = "In Stock";
          needsSave = true;
        }
      }

      if (needsSave) {
        await product.save({ session });
      }
    }

    // 3. User Order Creation - Format the order properly
    const formattedOrder = {
      products: formattedProducts,
      username: orderDetails.username,
      shippingMethod: orderDetails.shippingMethod,
      email: orderDetails.email,
      phone: orderDetails.phone,
      addressType: orderDetails.addressType,
      addressLine1: orderDetails.addressLine1,
      addressLine2: orderDetails.addressLine2,
      address: orderDetails.address,
      city: orderDetails.city,
      state: orderDetails.state,
      country: orderDetails.country,
      postalCode: orderDetails.postalCode,
      totalAmount: orderDetails.totalAmount,
      deliveryStatus: orderDetails.deliveryStatus,
      paymentStatus: orderDetails.paymentStatus,
      date: Date.now() 
    };

    console.log('📦 Formatted Order Data:', JSON.stringify(formattedOrder, null, 2));

    let updateQuery = { $push: { orders: formattedOrder } };

    // SAVE ADDRESS LOGIC
    if (orderDetails.saveAddress && email) {
        
        const userForCheck = await User.findOne({ email }).session(session);
        
        if (userForCheck) {
            const addressExists = userForCheck.savedAddresses.some(addr => 
                addr.addressLine1.toLowerCase() === orderDetails.addressLine1.toLowerCase() && 
                addr.postalCode === orderDetails.postalCode
            );
            
            if (!addressExists) {
                const newAddress = {
                    addressType: orderDetails.addressType || "Home",
                    addressLine1: orderDetails.addressLine1,
                    addressLine2: orderDetails.addressLine2 || "",
                    city: orderDetails.city,
                    state: orderDetails.state,
                    country: orderDetails.country,
                    postalCode: orderDetails.postalCode,
                    isDefault: userForCheck.savedAddresses.length === 0 // Default if it's the first one
                };
                
                // Add to the updates
                updateQuery.$push.savedAddresses = newAddress;
            }
        }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email },
      updateQuery,
      { new: true, session }
    );

    if (!updatedUser) {
      throw new CustomErrorHandler(404, "User not found to place order");
    }

    if (session) {
      await session.commitTransaction();
      session.endSession();
    }

    res.status(201).json({ message: "Order successful", user: updatedUser });

  } catch (error) {
    if (session) {
      await session.abortTransaction();
      session.endSession();
    }
    throw new CustomErrorHandler(error.statusCode || 500, error.message);
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
          phone: order.phone || user.phone || 'N/A',
          product: firstProduct?.title || 'Multiple Products',
          productCount: order.products.length,
          amount: order.totalAmount,
          status: order.deliveryStatus === 'delivered' ? 'Delivered' :
            order.deliveryStatus === 'cancelled' ? 'Cancelled' :
              'Processing',
          paymentStatus: order.payment?.status == 'paid' ? 'Paid' : order.paymentStatus, // Use granular status if available
          paymentMethod: order.payment?.method || 'N/A',
          paymentId: order.payment?.razorpayPaymentId || 'N/A',
          date: new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          rawDate: order.date,
          addressType: order.addressType || 'Home',
          addressLine1: order.addressLine1 || '',
          addressLine2: order.addressLine2 || '',
          address: order.address,
          city: order.city,
          state: order.state || '',
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

    // Update order fields using findOneAndUpdate to avoid validation issues
    const updatedUser = await User.findOneAndUpdate(
      {
        "_id": user._id,
        "orders._id": orderId
      },
      {
        $set: {
          "orders.$.tracking": {
            carrier,
            trackingId,
            trackingUrl
          },
          "orders.$.deliveryStatus": "Shipped"
        }
      },
      {
        new: true,
        runValidators: false // Skip validation to avoid firstName/lastName errors
      }
    );

    if (!updatedUser) {
      throw new CustomErrorHandler(500, "Failed to update tracking information");
    }

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
