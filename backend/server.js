const express = require('express');
const cors = require('cors');
const path = require('path');
const recurly = require('recurly');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Recurly Configuration
// TODO: Replace with your actual Recurly subdomain
const RECURLY_SUBDOMAIN = 'YOUR_SUBDOMAIN'; // e.g., 'mycompany'

// Initialize Recurly client
const client = new recurly.Client('e82b4caaf1e24964a1ce22588840b921'); // Your private API key

// Endpoint to create a subscription
app.post('/api/subscribe', async (req, res) => {
    try {
        const { token, planCode, email, firstName, lastName } = req.body;

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
    res.sendFile(path.join(__dirname, 'public', 'payment.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Recurly Backend Server running on http://localhost:${PORT}`);
    console.log(`📄 Payment page: http://localhost:${PORT}/payment.html`);
});
