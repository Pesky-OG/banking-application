const express = require('express');
const app = express();

const PORT = process.env.PORT || 3002;

// Middleware to parse JSON bodies
app.use(express.json());

// In-memory database
let accounts = [];

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Middleware for validating account existence
function validateAccount(req, res, next) {
    const { accountId } = req.params;
    const account = accounts.find(acc => acc.accountId === accountId);
    if (!account) {
        return res.status(404).json({ error: 'Account not found' });
    }
    next();
}

// Middleware for validating account creation data
function validateAccountCreation(req, res, next) {
    const { accountId, balance } = req.body;

    // Check if accountId is provided, is a string, and has exactly 10 digits
    if (!accountId || typeof accountId !== 'string' || !/^\d{10}$/.test(accountId)) {
        return res.status(400).json({ error: 'Invalid accountId. Must be exactly 10 digits' });
    }

    // Check if balance is provided and is a valid number
    if (!balance || isNaN(balance)) {
        return res.status(400).json({ error: 'Invalid balance' });
    }

    const parsedBalance = parseFloat(balance);
    if (parsedBalance < 0) {
        return res.status(400).json({ error: 'Balance must be a non-negative number' });
    }

    if (accounts.some(acc => acc.accountId === accountId)) {
        return res.status(400).json({ error: 'An account with the same accountId already exists' });
    }

    next();
}

// Endpoint for creating an account
app.post('/accounts', validateAccountCreation, (req, res, next) => {
    const { accountId, balance } = req.body;
    accounts.push({ accountId, balance });
    res.status(201).json({ message: 'Account created successfully' });
});

// Endpoint for balance inquiry
app.get('/accounts/:accountId', validateAccount, (req, res) => {
    const { accountId } = req.params;
    const account = accounts.find(acc => acc.accountId === accountId);
    res.json({ balance: account.balance });
});

// Endpoint for deposits
app.post('/accounts/:accountId/deposit', validateAccount, (req, res) => {
    const { amount } = req.body;
    const { accountId } = req.params;
    const account = accounts.find(acc => acc.accountId === accountId);
    account.balance += parseFloat(amount);
    res.json({ message: 'Deposit successful', balance: account.balance });
});

// Endpoint for withdrawals
app.post('/accounts/:accountId/withdraw', validateAccount, (req, res) => {
    const { amount } = req.body;
    const { accountId } = req.params;
    const account = accounts.find(acc => acc.accountId === accountId);
    if (account.balance < amount) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }
    account.balance -= parseFloat(amount);
    res.json({ message: 'Withdrawal successful', balance: account.balance });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // Export the Express application instance
