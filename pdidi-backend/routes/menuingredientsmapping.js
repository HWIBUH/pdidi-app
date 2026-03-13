const express = require('express');
const models = require('../models');
const MenuIngredientsMapping = models.MenuIngredientsMapping;
const Menu = models.Menu;
const Ingredients = models.Ingredients;
const { authenticate, isAdmin } = require('../middlewares/middleware');

const router = express.Router();

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { menu_id, ingredients_id } = req.body;
    
    if (!menu_id || !ingredients_id) {
      return res.status(400).json({ error: 'menu_id and ingredients_id required' });
    }
    
    const menu = await Menu.findByPk(menu_id);
    const ingredient = await Ingredients.findByPk(ingredients_id);
    
    if (!menu || !ingredient) {
      return res.status(404).json({ error: 'Menu or ingredient not found' });
    }
    
    const existingMapping = await MenuIngredientsMapping.findOne({
      where: { menu_id, ingredients_id }
    });
    
    if (existingMapping) {
      return res.status(400).json({ error: 'Mapping already exists' });
    }
    
    const mapping = await MenuIngredientsMapping.create({
      menu_id,
      ingredients_id
    });
    
    res.status(201).json(mapping);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const mappings = await MenuIngredientsMapping.findAll();
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/menu/:menu_id', async (req, res) => {
  try {
    const mappings = await MenuIngredientsMapping.findAll({
      where: { menu_id: req.params.menu_id },
      include: [{ model: Ingredients, as: 'ingredient' }]
    });
    
    if (mappings.length === 0) {
      return res.status(404).json({ error: 'No ingredients found for this menu item' });
    }
    
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/ingredient/:ingredients_id', async (req, res) => {
  try {
    const mappings = await MenuIngredientsMapping.findAll({
      where: { ingredients_id: req.params.ingredients_id },
      include: [{ model: Menu, as: 'menu' }]
    });
    
    if (mappings.length === 0) {
      return res.status(404).json({ error: 'No menu items found with this ingredient' });
    }
    
    res.json(mappings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:mapping_id', authenticate, isAdmin, async (req, res) => {
  try {
    const mapping = await MenuIngredientsMapping.findByPk(req.params.mapping_id);
    if (!mapping) {
      return res.status(404).json({ error: 'Mapping not found' });
    }
    
    await mapping.destroy();
    res.json({ message: 'Mapping deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

/**
 * @swagger
 * /api/menu-ingredients:
 *   post:
 *     summary: Link ingredient to menu item
 *     tags: [Menu Ingredients]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menu_id
 *               - ingredients_id
 *             properties:
 *               menu_id:
 *                 type: integer
 *               ingredients_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Mapping created successfully
 *       400:
 *         description: Missing fields or mapping already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Menu or ingredient not found
 *   get:
 *     summary: Get all menu-ingredient mappings
 *     tags: [Menu Ingredients]
 *     responses:
 *       200:
 *         description: List of all mappings
 */

/**
 * @swagger
 * /api/menu-ingredients/menu/{menu_id}:
 *   get:
 *     summary: Get ingredients for a menu item
 *     tags: [Menu Ingredients]
 *     parameters:
 *       - in: path
 *         name: menu_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of ingredients for the menu item
 *       404:
 *         description: No ingredients found for this menu item
 */

/**
 * @swagger
 * /api/menu-ingredients/ingredient/{ingredients_id}:
 *   get:
 *     summary: Get menu items containing an ingredient
 *     tags: [Menu Ingredients]
 *     parameters:
 *       - in: path
 *         name: ingredients_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of menu items with this ingredient
 *       404:
 *         description: No menu items found with this ingredient
 */

/**
 * @swagger
 * /api/menu-ingredients/{mapping_id}:
 *   delete:
 *     summary: Remove ingredient from menu item
 *     tags: [Menu Ingredients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mapping_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Mapping deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Mapping not found
 */