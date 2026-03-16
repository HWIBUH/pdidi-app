const express = require('express');
const models = require('../models');
const { authenticate, isAdmin } = require('../middlewares/middleware');
const Menu = models.Menu;
const MenuIngredientsMapping = models.MenuIngredientsMapping
const Ingredients = models.Ingredients

const router = express.Router();

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, description, price, image, available } = req.body;
    
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price required' });
    }
    
    const menuItem = await Menu.create({
      name,
      description,
      price,
      image,
      available: available || true
    });
    
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const menus = await Menu.findAll()
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const menuItem = await Menu.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const menuItem = await Menu.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    await menuItem.update(req.body);
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const menuItem = await Menu.findByPk(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    await menuItem.destroy();
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * /api/menu:
 *   post:
 *     summary: Create new menu item
 *     tags: [Menu]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Menu item created
 *       400:
 *         description: Name and price required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *   get:
 *     summary: Get all menu items
 *     tags: [Menu]
 *     responses:
 *       200:
 *         description: List of all menu items
 */

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item found
 *       404:
 *         description: Menu item not found
 *   put:
 *     summary: Update menu item
 *     tags: [Menu]
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Menu item updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Menu item not found
 *   delete:
 *     summary: Delete menu item
 *     tags: [Menu]
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
 *         description: Menu item deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Menu item not found
 */