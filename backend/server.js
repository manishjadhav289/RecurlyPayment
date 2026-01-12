require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const recurly = require('recurly');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Recurly Configuration
const RECURLY_SUBDOMAIN = process.env.RECURLY_SUBDOMAIN;

// Initialize Recurly client
const client = new recurly.Client(process.env.RECURLY_PRIVATE_KEY);

// Endpoint to create a subscription
app.post('/api/subscribe', async (req, res) => {
    try {
        const { token, planCode, email, firstName, lastName, address1, city, state, postalCode, country } = req.body;

        console.log('Creating subscription:', { planCode, email });

        // First, create or get the account
        let account;
        const accountCode = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        try {
            account = await client.createAccount({
                code: accountCode,
                email: email,
                firstName: firstName || 'Customer',
                lastName: lastName || 'User',
                address: {
                    street1: address1,
                    city: city,
                    region: state,
                    postalCode: postalCode,
                    country: country,
                },
                billingInfo: {
                    tokenId: token,
                },
            });
            console.log('Account created:', account.id);
        } catch (accountError) {
            console.error('Account creation error:', accountError);
            throw accountError;
        }

        // Create the subscription
        const subscriptionCreate = {
            planCode: planCode,
            account: {
                code: accountCode,
            },
            currency: 'INR',
        };

        const subscription = await client.createSubscription(subscriptionCreate);
        console.log('Subscription created:', subscription.id);

        res.json({
            success: true,
            subscriptionId: subscription.id,
            accountId: account.id,
            state: subscription.state,
        });
    } catch (error) {
        console.error('Subscription error:', error);
        res.status(400).json({
            success: false,
            error: error.message || 'Failed to create subscription',
            details: error.params || null,
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the payment page
app.get('/payment.html', (req, res) => {
    res.render('payment', {
        publicKey: process.env.RECURLY_PUBLIC_KEY
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Recurly Backend Server running on http://localhost:${PORT}`);
    console.log(`📄 Payment page: http://localhost:${PORT}/payment.html`);
});
