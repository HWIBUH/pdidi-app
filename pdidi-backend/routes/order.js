const express = require('express');
const models = require('../models');
const Order = models.Order;
const User = models.User;
const Menu = models.Menu;
const { authenticate, isAdmin } = require('../middlewares/middleware');
const { Op, Sequelize } = require('sequelize');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { user_id, menu_id } = req.body;

    if (!user_id || !menu_id ) {
      return res.status(400).json({ error: 'user_id and menu_id required' });
    }

    const user = await User.findByPk(user_id);
    const menu = await Menu.findByPk(menu_id);

    if (!user || !menu) {
      return res.status(404).json({ error: 'User or menu not found' });
    }

    if (!menu.available) {
      return res.status(400).json({ error: 'Menu item is currently unavailable' });
    }

    let finalPrice = menu.price

    const discount = await models.Discount.findOne({
      where: {
        [Op.and]: [
          { validUntil: { [Op.gte]: new Date() } },
          Sequelize.where(Sequelize.col('slotsUsed'), Op.lt, Sequelize.col('slotQuantity'))
        ]
      },
      order: [['createdAt', 'DESC']]
    });

    if (discount) {
      finalPrice = total_price * (1 - discount.discountRate / 100);
      discount.slotsUsed += 1;
      await discount.save();
    }

    const order = await Order.create({
      user_id,
      menu_id,
      done: false,
      total_price: finalPrice,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, isAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user' },
        { model: Menu, as: 'menu' }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.params.user_id },
      include: [
        { model: User, as: 'user' },
        { model: Menu, as: 'menu' }
      ]
    });

    if (orders.length === 0) {
      return res.status(404).json({ error: 'No orders found for this user' });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Menu, as: 'menu' }
      ]
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.update(req.body);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/:id/toggle', authenticate, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.done = !order.done;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    await order.destroy();
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * /api/order:
 *   post:
 *     summary: Create new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - menu_id
 *             properties:
 *               user_id:
 *                 type: integer
 *               menu_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: User or menu not found
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

/**
 * @swagger
 * /api/order/user/{user_id}:
 *   get:
 *     summary: Get orders for a specific user
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user orders
 *       404:
 *         description: No orders found for this user
 */

/**
 * @swagger
 * /api/order/{id}:
 *   get:
 *     summary: Get order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order found
 *       404:
 *         description: Order not found
 *   put:
 *     summary: Update order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               done:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Order updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 *   delete:
 *     summary: Delete order
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */

/**
 * @swagger
 * /api/order/{id}/toggle:
 *   patch:
 *     summary: Toggle order done status
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Done status toggled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Order not found
 */