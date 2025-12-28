const User = require("../models/userData");
const CustomErrorHandler = require("../errors/customErrorHandler");

// Get all saved addresses for a user
const getUserAddresses = async (req, res) => {
    try {
        const { email } = req.user; // Assuming auth middleware adds user to req

        const user = await User.findOne({ email }).select('savedAddresses');

        if (!user) {
            throw new CustomErrorHandler(404, "User not found");
        }

        res.status(200).json({
            success: true,
            addresses: user.savedAddresses || []
        });
    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

// Add a new address
const addAddress = async (req, res) => {
    try {
        const { email } = req.body;
        const { addressType, addressLine1, addressLine2, city, state, country, postalCode, isDefault } = req.body;

        if (!addressLine1 || !city || !state || !country || !postalCode) {
            throw new CustomErrorHandler(400, "Please provide all required address fields");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomErrorHandler(404, "User not found");
        }

        // If this is set as default, unset all other defaults
        if (isDefault) {
            user.savedAddresses.forEach(addr => {
                addr.isDefault = false;
            });
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

        user.savedAddresses.push(newAddress);
        await user.save({ validateBeforeSave: false });

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            addresses: user.savedAddresses
        });
    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

// Update an existing address
const updateAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { email } = req.body;
        const { addressType, addressLine1, addressLine2, city, state, country, postalCode, isDefault } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomErrorHandler(404, "User not found");
        }

        const addressIndex = user.savedAddresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            throw new CustomErrorHandler(404, "Address not found");
        }

        // If this is set as default, unset all other defaults
        if (isDefault) {
            user.savedAddresses.forEach(addr => {
                addr.isDefault = false;
            });
        }

        user.savedAddresses[addressIndex] = {
            _id: user.savedAddresses[addressIndex]._id,
            addressType: addressType || "Home",
            addressLine1,
            addressLine2: addressLine2 || "",
            city,
            state,
            country,
            postalCode,
            isDefault: isDefault || false
        };

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            addresses: user.savedAddresses
        });
    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

// Delete an address
const deleteAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomErrorHandler(404, "User not found");
        }

        const addressIndex = user.savedAddresses.findIndex(
            addr => addr._id.toString() === addressId
        );

        if (addressIndex === -1) {
            throw new CustomErrorHandler(404, "Address not found");
        }

        user.savedAddresses.splice(addressIndex, 1);
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Address deleted successfully",
            addresses: user.savedAddresses
        });
    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

// Set default address
const setDefaultAddress = async (req, res) => {
    try {
        const { addressId } = req.params;
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomErrorHandler(404, "User not found");
        }

        // Unset all defaults
        user.savedAddresses.forEach(addr => {
            addr.isDefault = false;
        });

        // Set the selected one as default
        const address = user.savedAddresses.find(addr => addr._id.toString() === addressId);

        if (!address) {
            throw new CustomErrorHandler(404, "Address not found");
        }

        address.isDefault = true;
        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            success: true,
            message: "Default address updated successfully",
            addresses: user.savedAddresses
        });
    } catch (error) {
        throw new CustomErrorHandler(500, error.message);
    }
};

module.exports = {
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};
