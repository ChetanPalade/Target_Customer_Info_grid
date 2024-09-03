// Import dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected Successfully'))
    .catch(err => console.log('MongoDB connection error:', err));

// Define the Customer schema
const CustomerSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    currentOrganization: String
});

// Create a Customer model from the schema
const Customer = mongoose.model('Customer', CustomerSchema);

// Route to handle customer data submission
app.post('/api/customers', async (req, res) => {
    try {
        const customer = new Customer(req.body); // Create a new customer from the request body
        await customer.save(); // Save the customer to the database
        res.status(201).json(customer); // Send the saved customer as a response
    } catch (error) {
        res.status(400).json({ message: 'Error saving customer', error });
    }
});

// Route to fetch all customers from the database
app.get('/api/customers', async (req, res) => {
    try {
        const customers = await Customer.find(); // Fetch all customers from the database
        res.status(200).json(customers); // Send the customers as a response
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error });
    }
});

// Route to push customer data to the CRM system 
app.post('/api/push-to-crm', async (req, res) => {
    try {
        const customer = req.body;

        // Prepare JSON body for CRM push
        const crmData = {
            properties: {
                firstname: customer.firstName,
                lastname: customer.lastName,
                email: customer.email,
                phone: customer.phoneNumber,
                company: customer.currentOrganization,
                address: customer.address.street,
                city: customer.address.city,
                state: customer.address.state,
                zip: customer.address.zip
            }
        };

        // Send data to HubSpot CRM (or any other CRM system)
        const response = await axios.post('https://api.hubapi.com/crm/v3/objects/contacts', crmData, {
            headers: {
                'Authorization': `Bearer ${process.env.HUBSPOT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ message: 'Pushed to CRM successfully', response: response.data });
    } catch (error) {
        res.status(500).json({ message: 'Error pushing to CRM', error });
    }
});


// Start the Express server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
