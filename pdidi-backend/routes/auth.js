const express = require('express');
const models = require('../models')
const User = models.User;
const jwt = require('jsonwebtoken');
require("dotenv").config();

const router = express.Router();
const usernamePattern = /^[A-Z]{2}\d{2}-\d+$/;

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "GS25-1"
 *                 description: Username must follow pattern XX##-# (e.g., GS25-1, EV25-1)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *       400:
 *         description: Invalid username or user already exists
 *       500:
 *         description: Server error
 */
router.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }
    
    if (!usernamePattern.test(username)) {
      return res.status(400).json({ error: 'Username must follow pattern: XX##-# (e.g., GS25-1, EV25-1)' });
    }
    
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await User.create({ username });
    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "GS25-1"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 userId:
 *                   type: integer
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                   enum: [user, admin]
 *       401:
 *         description: Invalid username
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username required' });
    }
    
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username' });
    }
    
    res.json({ message: 'Login successful', userId: user.id, username: user.username, role: user.role });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/validate-admin:
 *   post:
 *     summary: Validate admin password and get JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *             properties:
 *               password:
 *                 type: string
 *                 description: Admin password from environment variable
 *     responses:
 *       200:
 *         description: Admin validated successfully, token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: JWT token with 24h expiration
 *       400:
 *         description: Password required
 *       401:
 *         description: Invalid password
 *       500:
 *         description: Server error
 */
router.post('/validate-admin', (req, res) => {
    const { password } = req.body;

    if(!password) {
        return res.status(400).json({ error: 'Password required' })
    }

    if(password === process.env.ADMIN_PASSWORD){
        const token = jwt.sign(
          { role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.cookie('adminToken', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",  
          path: '/',
          maxAge: 86400000 
        });

        return res.json({ message: 'Admin successfully validated', token })
    }

    return res.status(401).json({ error: 'Invalid password' });
})

module.exports = router;