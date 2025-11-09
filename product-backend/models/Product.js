const mongoose = require('mongoose');

// Define the structure (Schema) for a Product document
const productSchema = new mongoose.Schema({
  // 'name' will be a required string
  name: {
    type: String,
    required: true,
  },
  // 'price' will be a required number
  price: {
    type: Number,
    required: true,
  },
  // 'short_description' will be a string
  short_description: {
    type: String,
  },
  // 'image' will be a string (for the URL)
  image: {
    type: String,
  },
}, {
  // Adds 'createdAt' and 'updatedAt' timestamps automatically
  timestamps: true,
});

// Create the Model from the Schema
// The collection in MongoDB will be named 'products' (lowercase and pluralized)
const Product = mongoose.model('Product', productSchema);

module.exports = Product;