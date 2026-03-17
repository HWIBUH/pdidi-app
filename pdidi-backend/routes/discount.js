const express = require('express');
const models = require('../models');
const Discount = models.Discount;
const { authenticate, isAdmin } = require('../middlewares/middleware');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { discountRate, slotQuantity, validUntil } = req.body;
    
    if (!discountRate || !slotQuantity || !validUntil) {
      return res.status(400).json({ error: 'discountRate, slotQuantity, and validUntil required' });
    }
    
    if (discountRate < 0 || discountRate > 100) {
      return res.status(400).json({ error: 'discountRate must be between 0 and 100' });
    }
    
    const discount = await Discount.create({
      discountRate,
      slotQuantity,
      validUntil: new Date(validUntil)
    });
    
    res.status(201).json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const discount = await Discount.findOne({
      where: {
        [Op.and]: [
          { validUntil: { [Op.gte]: new Date() } },
          Sequelize.where(Sequelize.col('slotsUsed'), Op.lt, Sequelize.col('slotQuantity'))
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 1
    });
    
    res.json(discount || null);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/all', authenticate, isAdmin, async (req, res) => {
  try {
    const discounts = await Discount.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    if (req.body.discountRate && (req.body.discountRate < 0 || req.body.discountRate > 100)) {
      return res.status(400).json({ error: 'discountRate must be between 0 and 100' });
    }
    
    await discount.update(req.body);
    res.json(discount);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const discount = await Discount.findByPk(req.params.id);
    
    if (!discount) {
      return res.status(404).json({ error: 'Discount not found' });
    }
    
    await discount.destroy();
    res.json({ message: 'Discount deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * /api/discount:
 *   post:
 *     summary: Create new discount
 *     tags: [Discount]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - discountRate
 *               - slotQuantity
 *               - validUntil
 *             properties:
 *               discountRate:
 *                 type: number
 *                 description: Discount percentage (0-100)
 *               slotQuantity:
 *                 type: integer
 *                 description: Total number of discount slots available
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *                 description: Discount expiration date
 *     responses:
 *       201:
 *         description: Discount created successfully
 *       400:
 *         description: Invalid discount rate or missing fields
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *   get:
 *     summary: Get active discount (most recent valid one with available slots)
 *     tags: [Discount]
 *     responses:
 *       200:
 *         description: Active discount or null if none available
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/discount/all:
 *   get:
 *     summary: Get all discounts (admin only)
 *     tags: [Discount]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all discounts sorted by creation date (newest first)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/discount/{id}:
 *   get:
 *     summary: Get discount by ID
 *     tags: [Discount]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Discount ID
 *     responses:
 *       200:
 *         description: Discount found
 *       404:
 *         description: Discount not found
 *       500:
 *         description: Server error
 *   put:
 *     summary: Update discount (admin only)
 *     tags: [Discount]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Discount ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discountRate:
 *                 type: number
 *                 description: Discount percentage (0-100)
 *               slotQuantity:
 *                 type: integer
 *                 description: Total number of discount slots
 *               slotsUsed:
 *                 type: integer
 *                 description: Number of slots already used
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *                 description: Discount expiration date
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       400:
 *         description: Invalid discount rate
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Discount not found
 *   delete:
 *     summary: Delete discount (admin only)
 *     tags: [Discount]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Discount ID
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Discount not found
 */