const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItemId: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Menu item ID is required']
  },
  name: {
    type: String,
    required: [true, 'Item name is required']
  },
  price: {
    type: Number,
    required: [true, 'Item price is required'],
    min: 0
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 1
  },
  customizations: [String],
  specialInstructions: String
});

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  restaurantId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: [true, 'Restaurant ID is required']
  },
  items: [orderItemSchema],
  subtotal: {
    type: Number,
    required: [true, 'Subtotal is required'],
    min: 0
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Delivery fee is required'],
    min: 0
  },
  tax: {
    type: Number,
    required: [true, 'Tax is required'],
    min: 0
  },
  total: {
    type: Number,
    required: [true, 'Total is required'],
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cash', 'digital_wallet'],
    required: [true, 'Payment method is required']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentIntentId: String, // For Stripe integration
  deliveryAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: {
      type: String,
      required: [true, 'Zip code is required']
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  customerInfo: {
    name: {
      type: String,
      required: [true, 'Customer name is required']
    },
    phone: {
      type: String,
      required: [true, 'Customer phone is required']
    },
    email: {
      type: String,
      required: [true, 'Customer email is required']
    }
  },
  restaurantInfo: {
    name: String,
    phone: String,
    address: String
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  estimatedDeliveryTime: {
    type: Date,
    required: [true, 'Estimated delivery time is required']
  },
  actualDeliveryTime: Date,
  specialInstructions: String,
  driverId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  rating: {
    food: { type: Number, min: 1, max: 5 },
    delivery: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 },
    comment: String
  },
  refundAmount: {
    type: Number,
    min: 0,
    default: 0
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Calculate estimated delivery time before saving
orderSchema.pre('save', function(next) {
  if (!this.estimatedDeliveryTime) {
    // Add 30-45 minutes to current time as default
    const now = new Date();
    const estimatedTime = new Date(now.getTime() + (35 * 60 * 1000)); // 35 minutes
    this.estimatedDeliveryTime = estimatedTime;
  }
  next();
});

// Update payment status when order status changes
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'confirmed' && this.paymentStatus === 'pending') {
      this.paymentStatus = 'paid';
    } else if (this.status === 'cancelled' && this.paymentStatus === 'paid') {
      this.paymentStatus = 'refunded';
    }
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);