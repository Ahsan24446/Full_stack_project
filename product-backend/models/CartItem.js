const mongoose = require('mongoose');

// We'll create a simple schema representing a single item in a user's cart.
// In a real application, you would link this to a User model.
const cartItemSchema = new mongoose.Schema({
  // product field references the actual Product document by its _id
  product: {
    type: mongoose.Schema.Types.ObjectId, // This is the unique MongoDB ID type
    ref: 'Product', // This links it to the 'Product' model we created earlier
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1
  },
  // In a full application, you would also add a 'userId' field here.
}, {
  timestamps: true,
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = CartItem;