require("dotenv").config();
const connectDb = require("./db/connect");
const User = require("./models/userData");
const Admin = require("./models/admin");
const bcryptjs = require("bcryptjs");

const createDefaultUsers = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await connectDb(process.env.MONGO_URI);
    console.log("✅ Connected to database successfully!");

    // Create default admin user
    const adminEmail = "admin@auffur.com";
    const adminPassword = "Admin@123";
    const hashedAdminPassword = await bcryptjs.hash(adminPassword, 10);

    // Check if admin user already exists
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      console.log("📝 Creating admin user...");
      adminUser = await User.create({
        email: adminEmail,
        username: "Admin User",
        password: hashedAdminPassword,
        verificationStatus: "verified",
        verificationToken: "admin-verified-token",
        adminStatus: true,
      });
      console.log("✅ Admin user created!");
    } else {
      console.log("ℹ️  Admin user already exists");
      // Update to make sure it's verified and has admin status
      await User.findByIdAndUpdate(adminUser._id, {
        verificationStatus: "verified",
        adminStatus: true,
      });
    }

    // Create admin record with rank 1 (super admin)
    let adminRecord = await Admin.findOne({ userData: adminUser._id });
    
    if (!adminRecord) {
      console.log("📝 Creating admin record...");
      await Admin.create({
        userData: adminUser._id,
        adminRank: 1,
        lastLogin: new Date(),
      });
      console.log("✅ Admin record created with rank 1 (Super Admin)!");
    } else {
      console.log("ℹ️  Admin record already exists");
    }

    // Create default regular user
    const userEmail = "user@auffur.com";
    const userPassword = "User@123";
    const hashedUserPassword = await bcryptjs.hash(userPassword, 10);

    let regularUser = await User.findOne({ email: userEmail });
    
    if (!regularUser) {
      console.log("📝 Creating regular user...");
      await User.create({
        email: userEmail,
        username: "Test User",
        password: hashedUserPassword,
        verificationStatus: "verified",
        verificationToken: "user-verified-token",
        adminStatus: false,
      });
      console.log("✅ Regular user created!");
    } else {
      console.log("ℹ️  Regular user already exists");
      // Make sure it's verified
      await User.findByIdAndUpdate(regularUser._id, {
        verificationStatus: "verified",
      });
    }

    console.log("\n🎉 Default users setup complete!");
    console.log("\n📋 LOGIN CREDENTIALS:\n");
    console.log("=" .repeat(50));
    console.log("🔐 ADMIN USER:");
    console.log("   Email:    admin@auffur.com");
    console.log("   Password: Admin@123");
    console.log("   Path:     http://localhost:3000/administrator");
    console.log("=" .repeat(50));
    console.log("👤 REGULAR USER:");
    console.log("   Email:    user@auffur.com");
    console.log("   Password: User@123");
    console.log("   Path:     http://localhost:3000/login");
    console.log("=" .repeat(50));

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createDefaultUsers();
