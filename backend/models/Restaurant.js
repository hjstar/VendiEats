const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a menu item name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: 0
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  preparationTime: {
    type: Number,
    required: [true, 'Please add preparation time in minutes'],
    min: 1
  },
  ingredients: [String],
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  tags: [String] // spicy, popular, new, etc.
}, {
  timestamps: true
});

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a restaurant name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Please add a restaurant image']
  },
  coverImage: {
    type: String,
    required: [true, 'Please add a cover image']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Italian', 'Chinese', 'Mexican', 'Indian', 'American', 'Japanese', 'Thai', 'Mediterranean', 'Fast Food', 'Desserts', 'Other']
  },
  address: {
    street: {
      type: String,
      required: [true, 'Please add a street address']
    },
    city: {
      type: String,
      required: [true, 'Please add a city']
    },
    state: {
      type: String,
      required: [true, 'Please add a state']
    },
    zipCode: {
      type: String,
      required: [true, 'Please add a zip code']
    },
    country: {
      type: String,
      default: 'USA'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Please add coordinates'],
      index: '2dsphere'
    }
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  website: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  deliveryTime: {
    type: String,
    required: [true, 'Please add estimated delivery time'],
    default: '30-45 min'
  },
  deliveryFee: {
    type: Number,
    required: [true, 'Please add delivery fee'],
    min: 0,
    default: 2.99
  },
  minimumOrder: {
    type: Number,
    min: 0,
    default: 0
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  openingHours: {
    monday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      closed: { type: Boolean, default: false }
    },
    tuesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      closed: { type: Boolean, default: false }
    },
    wednesday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      closed: { type: Boolean, default: false }
    },
    thursday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      closed: { type: Boolean, default: false }
    },
    friday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '23:00' },
      closed: { type: Boolean, default: false }
    },
    saturday: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '23:00' },
      closed: { type: Boolean, default: false }
    },
    sunday: {
      open: { type: String, default: '10:00' },
      close: { type: String, default: '21:00' },
      closed: { type: Boolean, default: false }
    }
  },
  menu: [menuItemSchema],
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Restaurant must belong to an owner']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: {
    delivery: { type: Boolean, default: true },
    pickup: { type: Boolean, default: true },
    dineIn: { type: Boolean, default: false }
  },
  paymentMethods: {
    type: [String],
    default: ['card', 'cash', 'digital_wallet']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Create restaurant slug from the name
restaurantSchema.pre('save', function(next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
  next();
});

// Geocode & create location field
restaurantSchema.pre('save', function(next) {
  // In a real application, you would use a geocoding service here
  // For now, we'll assume coordinates are provided
  next();
});

module.exports = mongoose.model('Restaurant', restaurantSchema);