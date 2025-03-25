require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000; // Default port to 3000 if not set in .env

// Middleware for parsing JSON requests
app.use(bodyParser.json());

// MongoDB Atlas connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

// Define the MenuItem schema
const MenuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true }
});

const MenuItem = mongoose.model('MenuItem', MenuItemSchema);

// POST /menu - Create a new menu item
app.post('/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Validation check
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }

    // Create and save the new menu item
    const newItem = new MenuItem({ name, description, price });
    await newItem.save();

    res.status(201).json({ message: 'Menu item created successfully!', data: newItem });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item.', details: error.message });
  }
});

// GET /menu - Fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find(); // Fetch all menu items
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items.', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
