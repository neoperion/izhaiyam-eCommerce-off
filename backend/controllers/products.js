const Product = require("../models/products");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const CustomErrorHandler = require("../errors/customErrorHandler");
const { title } = require("process");

const createProducts = async (req, res) => {
  console.log("Create Product Request Body:", req.body);
  
  // Auto-assign displayOrder if not provided
  if (req.body.displayOrder !== undefined && req.body.displayOrder !== null && req.body.displayOrder !== "") {
      const newOrder = parseInt(req.body.displayOrder);
      // Shift existing products down to make space: displayOrder >= newOrder -> +1
      await Product.updateMany(
          { displayOrder: { $gte: newOrder } },
          { $inc: { displayOrder: 1 } }
      );
      req.body.displayOrder = newOrder;
  } else {
      const lastProduct = await Product.findOne().sort({ displayOrder: -1 });
      req.body.displayOrder = lastProduct && lastProduct.displayOrder ? lastProduct.displayOrder + 1 : 1;
  }

  const product = await Product.create(req.body);
  console.log("Created Product:", product);
  res.status(201).json(product);
};

const getAllProducts = async (req, res) => {
  const { featured, limit } = req.query;
  const queryObject = {};

  if (featured) {
    queryObject.isFeatured = featured === "true";
  }

  // Default Sort: Pinned first, then by displayOrder (ASC), then by createdAt (newest fallback)
  let result = Product.find(queryObject).sort({ isPinned: -1, displayOrder: 1, createdAt: -1 });

  if (limit) {
    const limitVal = Number(limit) || 10;
    result = result.limit(limitVal);
  }

  const products = await result;

  res.status(200).json({ message: "success", products });
};

const uploadProductImages = async (req, res) => {
  if (!req.files || !req.files.image) {
    throw new CustomErrorHandler(400, "No image was uploaded");
  }
  if (!req.files.image.mimetype.includes("image")) {
    throw new CustomErrorHandler(415, "invalid image type");
  }
  if (req.files.image.size > 3 * 1024 * 1024) {
    throw new CustomErrorHandler(400, "Image size has exceeded the limit");
  }
  const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
    use_filename: true,
    folder: "file-Auffur",
  });
  fs.unlinkSync(req.files.image.tempFilePath);

  return res.status(201).json({ image: { src: result.secure_url } });
};

const getAspecificProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }
  const checkIfProductExist = await Product.findById({ _id: id }).select({
    _id: 1,
    title: 1,
    stock: 1,
    price: 1,
    discountPercentValue: 1,
    categories: 1,
    image: 1,
    description: 1,
    colors: 1,
    isCustomizable: 1,
    colorVariants: 1,
    displayOrder: 1,
    isPinned: 1,
  });
  if (!checkIfProductExist) {
    throw new CustomErrorHandler(404, "Products not found");
  }
  res.status(200).json({ message: "success", product: checkIfProductExist });
};

const deleteAspecificProduct = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new CustomErrorHandler(401, "parameters missing");
  }

  const productToDelete = await Product.findById(id);
  if (!productToDelete) {
    throw new CustomErrorHandler(404, "Products not found");
  }

  const deletedOrder = productToDelete.displayOrder;

  const product = await Product.findByIdAndDelete(id);
  
  // Reindex: Shift items > deletedOrder UP (-1) to close gap
  if (deletedOrder) {
      await Product.updateMany(
          { displayOrder: { $gt: deletedOrder } },
          { $inc: { displayOrder: -1 } }
      );
  }

  res.status(201).json({ message: "success", product });
};

const updateAspecificProduct = async (req, res) => {
  const updatedData = req.body;
  const { id } = req.params;
  if (!id || !updatedData) {
    throw new CustomErrorHandler(401, "parameters missing");
  }

  // Fetch current product to find old displayOrder
  const currentProduct = await Product.findById(id);
  if (!currentProduct) {
      throw new CustomErrorHandler(404, "Product not found");
  }

  // Handle Display Order Reindexing if changed
  if (updatedData.displayOrder !== undefined && updatedData.displayOrder !== null && updatedData.displayOrder !== "") {
      const newOrder = parseInt(updatedData.displayOrder);
      const oldOrder = currentProduct.displayOrder;

      // Only reindex if the order actually changed
      if (oldOrder !== undefined && newOrder !== oldOrder) {
          if (newOrder < oldOrder) {
              // Moving UP: Shift items in [newOrder, oldOrder - 1] DOWN (+1)
              await Product.updateMany(
                  { displayOrder: { $gte: newOrder, $lt: oldOrder } },
                  { $inc: { displayOrder: 1 } }
              );
          } else {
              // Moving DOWN: Shift items in [oldOrder + 1, newOrder] UP (-1)
              await Product.updateMany(
                  { displayOrder: { $gt: oldOrder, $lte: newOrder } },
                  { $inc: { displayOrder: -1 } }
              );
          }
      }
      updatedData.displayOrder = newOrder;
  }

  console.log("Update Product Request Body:", updatedData);
  const Updatedproduct = await Product.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });
  console.log("Updated Product Result:", Updatedproduct);

  res.status(201).json({ message: "product successfully updated", product: Updatedproduct });
};

const searchProducts = async (req, res) => {
  const { title, pageNo, perPage } = req.query;
  if (!title || !pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing");
  }

  const searchLength = await Product.countDocuments({ title: { $regex: title, $options: "i" } });
  const searchedProducts = await Product.find({ title: { $regex: title, $options: "i" } })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);

  res.status(201).json({ product: searchedProducts, productsLength: searchLength });
};

const sortByLowStockProducts = async (req, res) => {
  const { pageNo, perPage } = req.query;
  if (!pageNo || !perPage) {
    throw new CustomErrorHandler(400, "parameters missing");
  }
  const productsLength = await Product.countDocuments();

  const sortedProducts = await Product.find({})
    .sort({ stock: 1 })
    .skip((pageNo - 1) * perPage)
    .limit(perPage);

  res.status(201).json({ products: sortedProducts, productsLength });
};

module.exports = {
  getAllProducts,
  createProducts,
  uploadProductImages,
  getAspecificProduct,
  deleteAspecificProduct,
  updateAspecificProduct,
  searchProducts,
  sortByLowStockProducts,
};

const reindexAllProducts = async (req, res) => {
  // Fetch all products, sorted by Pinned > DisplayOrder > UpdatedAt
  const products = await Product.find({}).sort({ isPinned: -1, displayOrder: 1, createdAt: -1 });

  // Update each product to have displayOrder = index + 1
  const bulkOps = products.map((product, index) => {
      return {
          updateOne: {
              filter: { _id: product._id },
              update: { $set: { displayOrder: index + 1 } }
          }
      };
  });

  if (bulkOps.length > 0) {
      await Product.bulkWrite(bulkOps);
  }

  res.status(200).json({ message: "All products reindexed successfully" });
};

module.exports = {
  getAllProducts,
  createProducts,
  uploadProductImages,
  getAspecificProduct,
  deleteAspecificProduct,
  updateAspecificProduct,
  searchProducts,
  sortByLowStockProducts,
  reindexAllProducts,
};
