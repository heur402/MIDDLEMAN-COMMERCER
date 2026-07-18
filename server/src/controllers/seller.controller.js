// server/src/controllers/seller.controller.js
import { Product } from '../models/product.model.js';
import { Order } from '../models/order.model.js';
import { User } from '../models/user.model.js';
import { Review } from '../models/review.model.js';
import mongoose from 'mongoose';

// Get seller dashboard data
export const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Get counts
    const [totalProducts, totalOrders, totalRevenue, pendingOrders] = await Promise.all([
      Product.countDocuments({ sellerId, status: 'published' }),
      Order.countDocuments({ sellerId }),
      Order.aggregate([
        { $match: { sellerId: new mongoose.Types.ObjectId(sellerId), status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Order.countDocuments({ sellerId, status: 'pending' }),
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('buyerId', 'name email');

    // Recent products (last 5)
    const recentProducts = await Product.find({ sellerId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingOrders,
      },
      recentOrders,
      recentProducts,
    });
  } catch (error) {
    console.error('Error fetching seller dashboard:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get seller products with filtering
export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = { sellerId };
    if (status) filter.status = status;
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get seller orders
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page = 1, limit = 20, status } = req.query;

    const filter = { sellerId };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip)
        .populate('buyerId', 'name email')
        .populate('items.productId', 'title images price'),
      Order.countDocuments(filter),
    ]);

    res.json({
      orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update seller profile
export const updateSellerProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { storeName, storeDescription, storeLogo, storeBanner, contactPhone } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user is a seller
    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'User is not a seller' });
    }

    // Update seller profile fields
    user.sellerProfile = {
      ...user.sellerProfile,
      storeName: storeName || user.sellerProfile?.storeName,
      storeDescription: storeDescription || user.sellerProfile?.storeDescription,
      storeLogo: storeLogo || user.sellerProfile?.storeLogo,
      storeBanner: storeBanner || user.sellerProfile?.storeBanner,
      contactPhone: contactPhone || user.sellerProfile?.contactPhone,
    };

    await user.save();

    res.json({
      message: 'Seller profile updated successfully',
      sellerProfile: user.sellerProfile,
    });
  } catch (error) {
    console.error('Error updating seller profile:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get seller analytics
export const getSellerAnalytics = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { period = '30d' } = req.query;

    // Calculate date range
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get order analytics
    const orderAnalytics = await Order.aggregate([
      {
        $match: {
          sellerId: new mongoose.Types.ObjectId(sellerId),
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' },
          averageOrderValue: { $avg: '$totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);

    // Get product performance
    const productPerformance = await Product.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'items.productId',
          as: 'orders',
        },
      },
      {
        $project: {
          title: 1,
          price: 1,
          orderCount: { $size: '$orders' },
          totalRevenue: { $sum: '$orders.totalAmount' },
        },
      },
      { $sort: { orderCount: -1 } },
      { $limit: 10 },
    ]);

    res.json({
      period: days,
      orderAnalytics,
      productPerformance,
      summary: {
        totalOrders: orderAnalytics.reduce((sum, item) => sum + item.orders, 0),
        totalRevenue: orderAnalytics.reduce((sum, item) => sum + item.revenue, 0),
        averageOrderValue: orderAnalytics.length > 0 
          ? orderAnalytics.reduce((sum, item) => sum + item.averageOrderValue, 0) / orderAnalytics.length
          : 0,
      },
    });
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update seller settings
export const updateSellerSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { 
      autoAcceptOrders, 
      shippingPolicy, 
      returnPolicy,
      shippingRates,
      businessHours,
      notificationPreferences 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'seller') {
      return res.status(403).json({ message: 'User is not a seller' });
    }

    user.sellerSettings = {
      ...user.sellerSettings,
      autoAcceptOrders: autoAcceptOrders !== undefined ? autoAcceptOrders : user.sellerSettings?.autoAcceptOrders,
      shippingPolicy: shippingPolicy || user.sellerSettings?.shippingPolicy,
      returnPolicy: returnPolicy || user.sellerSettings?.returnPolicy,
      shippingRates: shippingRates || user.sellerSettings?.shippingRates,
      businessHours: businessHours || user.sellerSettings?.businessHours,
      notificationPreferences: notificationPreferences || user.sellerSettings?.notificationPreferences,
    };

    await user.save();

    res.json({
      message: 'Seller settings updated successfully',
      sellerSettings: user.sellerSettings,
    });
  } catch (error) {
    console.error('Error updating seller settings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get seller reviews
export const getSellerReviews = async (req, res) => {
  try {
    const sellerId = req.user._id;
    const { page = 1, limit = 20, rating } = req.query;

    const filter = { sellerId };
    if (rating) filter.rating = parseInt(rating);

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(limit))
        .skip(skip)
        .populate('buyerId', 'name email')
        .populate('productId', 'title images'),
      Review.countDocuments(filter),
    ]);

    // Calculate average rating
    const ratingStats = await Review.aggregate([
      { $match: { sellerId: new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating',
          },
        },
      },
    ]);

    res.json({
      reviews,
      stats: ratingStats[0] || { averageRating: 0, totalReviews: 0 },
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching seller reviews:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Respond to a review
export const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const sellerId = req.user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if the review belongs to this seller
    if (review.sellerId.toString() !== sellerId.toString()) {
      return res.status(403).json({ message: 'You can only respond to reviews for your products' });
    }

    review.sellerResponse = {
      text: response,
      respondedAt: new Date(),
    };

    await review.save();

    res.json({
      message: 'Response added to review',
      review,
    });
  } catch (error) {
    console.error('Error responding to review:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};