const express = require('express');
const models = require('../models');
const Balance = models.Balance;
const { authenticate, isAdmin } = require('../middlewares/middleware');

const router = express.Router();

/**
 * @swagger
 * /api/balance:
 *   get:
 *     summary: Get current balance (latest record)
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current balance
 *       404:
 *         description: No balance record found
 *   post:
 *     summary: Add to balance
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Balance added
 *       400:
 *         description: Amount required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

router.get('/', async (req, res) => {
  try {
    const balance = await Balance.findOne({
      order: [['createdAt', 'DESC']]
    });
    
    if (!balance) {
      return res.status(404).json({ error: 'No balance record found' });
    }
    
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount required' });
    }
    
    const latestBalance = await Balance.findOne({
      order: [['createdAt', 'DESC']]
    });
    
    const currentBalance = latestBalance ? latestBalance.balance : 0;
    const newBalance = currentBalance + amount;
    
    const record = await Balance.create({
      balance: newBalance
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/balance/subtract:
 *   post:
 *     summary: Subtract from balance
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Balance subtracted
 *       400:
 *         description: Amount required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

router.post('/subtract', authenticate, isAdmin, async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ error: 'Amount required' });
    }
    
    // Get latest balance
    const latestBalance = await Balance.findOne({
      order: [['createdAt', 'DESC']]
    });
    
    const currentBalance = latestBalance ? latestBalance.balance : 0;
    const newBalance = currentBalance - amount;
    
    const record = await Balance.create({
      balance: newBalance
    });
    
    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;