const express = require("express");
const {
    getUserAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require("../controllers/addressManagement");

const router = express.Router();

router.route("/").get(getUserAddresses);
router.route("/add").post(addAddress);
router.route("/update/:addressId").put(updateAddress);
router.route("/delete/:addressId").delete(deleteAddress);
router.route("/setDefault/:addressId").put(setDefaultAddress);

module.exports = router;
