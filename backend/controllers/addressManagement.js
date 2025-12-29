const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");

// Get all saved addresses for a user
const getUserAddresses = async (req, res) => {
    const { userId } = req.user;
    
    // Find user and select only savedAddresses
    const user = await User.findById(userId).select('savedAddresses');

    if (!user) {
        throw new CustomErrorHandler(404, "User not found");
    }

    // Sort: Default address first
    const addresses = user.savedAddresses.sort((a, b) => (b.isDefault === true) - (a.isDefault === true));

    res.status(200).json({
        success: true,
        addresses: addresses || []
    });
};

// Add a new address
const addAddress = async (req, res) => {
    const { userId } = req.user;
    const { addressType, addressLine1, addressLine2, city, state, country, postalCode, isDefault } = req.body;

    // Basic Validation
    if (!addressLine1 || !city || !state || !country || !postalCode) {
        throw new CustomErrorHandler(400, "Please provide all required address fields");
    }

    const newAddress = {
        addressType: addressType || "Home",
        addressLine1,
        addressLine2: addressLine2 || "",
        city,
        state,
        country,
        postalCode,
        isDefault: isDefault || false
    };

    // If this new address is default, unset all existing defaults first
    if (isDefault) {
        await User.updateOne(
            { _id: userId },
            { $set: { "savedAddresses.$[].isDefault": false } }
        );
    }

    // Use $push to add the address atomically
    const user = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { savedAddresses: newAddress } },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new CustomErrorHandler(404, "User not found");
    }

    res.status(201).json({
        success: true,
        message: "Address added successfully",
        addresses: user.savedAddresses.sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
    });
};

// Update an existing address
const updateAddress = async (req, res) => {
    const { userId } = req.user;
    const { addressId } = req.params;
    const { addressType, addressLine1, addressLine2, city, state, country, postalCode, isDefault } = req.body;

    // If setting as default, unset all others first
    if (isDefault === true) {
         await User.updateOne(
            { _id: userId },
            { $set: { "savedAddresses.$[].isDefault": false } }
        );
    }

    // Construct update object dynamically to only update provided fields
    // But typically in a PUT/Form update we update all fields.
    // We will update the specific element using arrayFilters or positional operator.
    
    // Since we want to update specific fields of an element regardless of position (though we have ID):
    // Using arrayFilters is cleaner for updating specifically by ID.
    
    const updateFields = {
        "savedAddresses.$[elem].addressType": addressType,
        "savedAddresses.$[elem].addressLine1": addressLine1,
        "savedAddresses.$[elem].addressLine2": addressLine2,
        "savedAddresses.$[elem].city": city,
        "savedAddresses.$[elem].state": state,
        "savedAddresses.$[elem].country": country,
        "savedAddresses.$[elem].postalCode": postalCode
    };

    if (isDefault !== undefined) {
        updateFields["savedAddresses.$[elem].isDefault"] = isDefault;
    }

    const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: updateFields },
        { 
            new: true, 
            arrayFilters: [{ "elem._id": addressId }],
            runValidators: true 
        }
    );

    if (!user) {
         // Either user not found OR addressId not found (since arrayFilters didn't match?)
         // Actually findOneAndUpdate returns null only if QUERY doesn't match.
         // If arrayFilters doesn't match, it returns the doc but doesn't modify it.
         // So we should check if address actually exists first? 
         // Or just return the doc. The user might note that nothing changed if ID was wrong.
         // Let's do a quick check to be nice.
         const checkUser = await User.findOne({ _id: userId, "savedAddresses._id": addressId });
         if (!checkUser) throw new CustomErrorHandler(404, "Address not found");
         // If we are here, something else happened, but usually `user` would be found.
    }

    res.status(200).json({
        success: true,
        message: "Address updated successfully",
        addresses: user.savedAddresses.sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
    });
};

// Delete an address
const deleteAddress = async (req, res) => {
    const { userId } = req.user;
    const { addressId } = req.params;

    const user = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { savedAddresses: { _id: addressId } } },
        { new: true }
    );

    if (!user) {
        throw new CustomErrorHandler(404, "User not found or address not found");
    }

    res.status(200).json({
        success: true,
        message: "Address deleted successfully",
        addresses: user.savedAddresses.sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
    });
};

// Set default address
const setDefaultAddress = async (req, res) => {
    const { userId } = req.user;
    const { addressId } = req.params;

    // 1. Unset all defaults
    await User.updateOne(
        { _id: userId },
        { $set: { "savedAddresses.$[].isDefault": false } }
    );

    // 2. Set the selected one as default using positional operator $
    // We need to match the user AND the address to use $
    const user = await User.findOneAndUpdate(
        { _id: userId, "savedAddresses._id": addressId },
        { $set: { "savedAddresses.$.isDefault": true } },
        { new: true }
    );

    if (!user) {
        throw new CustomErrorHandler(404, "Address not found");
    }

    res.status(200).json({
        success: true,
        message: "Default address updated successfully",
        addresses: user.savedAddresses.sort((a, b) => (b.isDefault === true) - (a.isDefault === true))
    });
};

module.exports = {
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
