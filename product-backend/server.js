const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const initialProducts = require('./data'); 
const CartItem = require('./models/CartItem');

const app = express();
const PORT = 5000; 
// 🛑 IMPORTANT: Aapka MongoDB connection string.
const MONGODB_URI = 'mongodb+srv://Ahsan_DB:Ahsan_DB@cluster0.yrgjpat.mongodb.net/?appName=Cluster0'; 


// --- Database Connection ---
const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI); 
        console.log('✅ MongoDB connected successfully!');

        // Data Seeding (Initial products dalna)
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            await Product.insertMany(initialProducts);
            console.log('   Initial products seeded into the database.');
        } else {
            console.log(`   Database already contains ${productCount} products.`);
        }
        
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

connectDB();

// --- Middleware Configuration ---
app.use(cors());
app.use(express.json());


// ==========================================================
//                   PRODUCTS CRUD ENDPOINTS
// ==========================================================

// ... (Product CREATE, READ, UPDATE, DELETE routes are unchanged) ...

app.post('/products', async (req, res) => { /* ... (CREATE logic) ... */ });
app.get('/products', async (req, res) => { /* ... (READ ALL logic) ... */ });
app.get('/products/:id', async (req, res) => { /* ... (READ ONE logic) ... */ });
app.put('/products/:id', async (req, res) => { /* ... (UPDATE logic) ... */ });
app.delete('/products/:id', async (req, res) => { /* ... (DELETE logic) ... */ });


// ==========================================================
//                   CART ENDPOINTS (Complete CRUD for Cart Items)
// ==========================================================

// 6. 🛒 POST /cart/add route (Add item to cart in MongoDB)
app.post('/cart/add', async (req, res) => {
    const { productId, qty } = req.body; 
    
    if (!productId || !qty) {
        return res.status(400).json({ message: 'Product ID and quantity are required.' });
    }

    try {
        const newCartItem = new CartItem({ product: productId, qty: qty });
        await newCartItem.save();

        console.log(`POST /cart/add: Added product ${productId} to cart (Qty: ${qty}).`);
        
        res.status(201).json({ 
            message: 'Item added to cart successfully.',
            item: newCartItem 
        });

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ message: 'Failed to add item to cart. Internal server error.' });
    }
});

// 7. 🛒 READ ALL: GET /cart route (Database se sabhi cart items fetch karta hai)
app.get('/cart', async (req, res) => {
    try {
        // .populate('product') se 'product' field ki jagah poori product details milengi.
        const cartItems = await CartItem.find({}).populate('product'); 

        console.log(`GET /cart: Fetched ${cartItems.length} items from cart.`);
        res.json(cartItems);

    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Failed to fetch cart items.', error: error.message });
    }
});

// 8. 🛒 DELETE /cart/:id route (Cart se ek item hatata hai)
app.delete('/cart/:id', async (req, res) => {
    try {
        const itemId = req.params.id;
        
        // CartItem document ko uski _id se delete karein
        const deletedItem = await CartItem.findByIdAndDelete(itemId);

        if (!deletedItem) {
            return res.status(404).json({ message: 'Cart item not found for deletion.' });
        }
        
        console.log(`DELETE /cart/${itemId}: Cart item successfully deleted.`);
        res.status(204).send(); // Success, no content to send back

    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Failed to delete cart item.', error: error.message });
    }
});


// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`✅ Backend Server is running on http://localhost:${PORT}`);
});