const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Ticket = require('../models/Ticket');

// Register route
router.get('/register', (req, res) => {
    res.render('userRegister', { message: req.flash('message') });
});

router.post('/register', async (req, res) => {
    const { fullname, username, mobile_no, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('message', 'You are already registered');
            return res.redirect('/user/register');
        }
        const newUser = new User({ fullname, username, mobile_no, email, password });
        await newUser.save();
        res.redirect('/user/login');
    } catch (error) {
        console.error(error);
        res.redirect('/user/register');
    }
});

// Login route
router.get('/login', (req, res) => {
    res.render('userLogin', { message: req.flash('message') });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user || user.password !== password) {
            req.flash('message', 'Invalid username or password');
            return res.redirect('/user/login');
        }
        req.session.userId = user._id;
        res.redirect('/user/tickets');
    } catch (error) {
        console.error(error);
        res.redirect('/user/login');
    }
});

// Show ticket form
router.get('/tickets', (req, res) => {
    res.render('tickets', { message: req.flash('message') });
});

// Handle ticket form submission
router.post('/tickets', async (req, res) => {
    try {
        const {
            employeeName,
            employeeId,
            program,
            date,
            venue,
            vegRate,
            nonVegRate,
            vegCount,
            nonVegCount
        } = req.body;

        if (!req.session.userId) {
            return res.status(401).send('Unauthorized');
        }

        const newTicket = new Ticket({
            userId: req.session.userId,
            employeeName,
            employeeId,
            program,
            date: new Date(date),
            venue,
            vegPlateRate: parseFloat(vegRate),
            nonVegPlateRate: parseFloat(nonVegRate),
            vegCoupons: parseInt(vegCount),
            nonVegCoupons: parseInt(nonVegCount)
        });

        await newTicket.save();

        res.redirect('/user/done');
    } catch (error) {
        console.error('Error saving coupon request:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Ticket confirmation page
router.get('/done', (req, res) => {
    res.render('done');
});

module.exports = router;
