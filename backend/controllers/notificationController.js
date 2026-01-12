const Notification = require("../models/notification");
const CustomErrorHandler = require("../errors/customErrorHandler");

const getAllNotifications = async (req, res) => {
  const notifications = await Notification.find({}).sort({ createdAt: -1 });
  // Count unread
  const unreadCount = await Notification.countDocuments({ isRead: false });

  res.status(200).json({ notifications, unreadCount });
};

const markAsRead = async (req, res) => {
  const { id } = req.params;
  
  if (id === 'all') {
      const result = await Notification.updateMany({ isRead: false }, { isRead: true });
      if(req.io) req.io.emit("notification:markAllRead");
      return res.status(200).json({ message: "All notifications marked as read", count: result.modifiedCount });
  }

  const notification = await Notification.findByIdAndUpdate(
    id,
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new CustomErrorHandler(404, "Notification not found");
  }

  // Real-time Update
  if(req.io) req.io.emit("notification:update", notification);

  res.status(200).json({ notification });
};

// Internal helper function
const createNotification = async ({ title, message, type, productId, io }) => {
  try {
    const notification = await Notification.create({
      title,
      message,
      type,
      productId,
    });
    
    if (io) {
        io.emit("notification:new", notification);
    }
    
    return notification;
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
};

const deleteNotification = async (req, res) => {
    const { id } = req.params;

    if (id === 'all') {
        const result = await Notification.deleteMany({});
        if(req.io) req.io.emit("notification:clearAll");
        return res.status(200).json({ message: "All notifications cleared", count: result.deletedCount });
    }

    const notification = await Notification.findByIdAndDelete(id);

    if (!notification) {
        throw new CustomErrorHandler(404, "Notification not found");
    }

    // Real-time Update
    if(req.io) req.io.emit("notification:delete", id);

    res.status(200).json({ message: "Notification deleted" });
};

module.exports = {
  getAllNotifications,
  markAsRead,
  createNotification,
  deleteNotification
};
