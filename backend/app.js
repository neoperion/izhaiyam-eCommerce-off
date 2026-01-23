const express = require("express");
require("dotenv").config();
require("express-async-errors");
const connectDb = require("./db/connect");
const errorHandler = require("./middleware/errorHandler");
const pathNotFound = require("./middleware/pathNotFound");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");
const cors = require("cors");
const productRoute = require("./routes/productRoute");
const authRoute = require("./routes/authenticationRoute");
const adminRoute = require("./routes/adminRoutes");
const ordersRoute = require("./routes/ordersRoute");
const addressRoute = require("./routes/addressRoutes");
const instagramRoute = require("./routes/instagramRoute");
const notificationRoute = require("./routes/notificationRoutes");
const sitemapRoute = require("./routes/sitemapRoute");
const authRoutes = require("./routes/auth");
const { clearAdminJwt } = require("./controllers/admin");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://izhaiyam-e-commerce-off.vercel.app",
  "https://izhaiyam-e-commerce-mpa2s3wu3-neo-perion.vercel.app",
  "https://www.izhaiyam.com",
  "https://izhaiyam.com",
  "https://izhaiyam-ecommerce-off.onrender.com",
  "https://api.izhaiyam.com",
  process.env.FRONTEND_URL
].filter(Boolean);

const io = new Server(server, {
  cors: {
     origin: allowedOrigins,
    credentials: true
  }
});

//  middlewares
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none"); // or require-corp if needed, but unsafe-none is safer for broad compatibility
  next();
});
const compression = require("compression");
// ... imports

app.use(compression()); // Enable Gzip compression

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept", "Origin"]
}));

// File upload middleware MUST come before express.json() to handle multipart/form-data first
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

// Attach IO to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).send("<h1>Auffur,ecommerce server</h1> ");
});

app.use("/api/v1/products", productRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/auth", authRoutes);
app.use("/orders", ordersRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/instagram", instagramRoute);
app.use("/api/v1/admin/notifications", notificationRoute); 
app.use("/api/v1/webhooks/resend", require("./routes/resendWebhookRoute")); // Resend Webhooks
app.use("/api/v1/contact", require("./routes/contactRoute")); // Contact Form Route
app.use("/api/v1/gallery", require("./routes/galleryRoute")); // Gallery Images Route
app.use("/sitemap.xml", sitemapRoute);
app.use(errorHandler);
app.use(pathNotFound);

// clear admin token after 6 hours of inactivity
setInterval(clearAdminJwt, 6 * 60 * 60 * 1000);

const port = process.env.PORT || 5000;

// Socket Connection Logic
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const startServer = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    console.log("✅ Database connected successfully!");
    // CHANGE: Listen on 'server' instead of 'app'
    server.listen(port, () => console.log(`🚀 Server is listening on port ${port}`));
  } catch (error) {
    console.error("❌ Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();
