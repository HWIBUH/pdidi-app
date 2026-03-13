const express = require('express');
const models = require('../models');
const Ingredients = models.Ingredients;
const { authenticate, isAdmin } = require('../middlewares/middleware');

const router = express.Router();

router.post('/', authenticate, isAdmin, async (req, res) => {
  try {
    const { name, available } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name required' });
    }
    
    const ingredient = await Ingredients.create({
      name,
      available: available || true
    });
    
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredients.findAll();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ingredient = await Ingredients.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const ingredient = await Ingredients.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    const wasAvailable = ingredient.available;
    ingredient.available = !ingredient.available;
    await ingredient.save();

    const MenuIngredientsMapping = models.MenuIngredientsMapping;
    const Menu = models.Menu;
    
    const mappings = await MenuIngredientsMapping.findAll({
      where: { ingredients_id: req.params.id }
    });
    
    if (!ingredient.available) {
      for (const mapping of mappings) {
        await Menu.update(
          { available: false },
          { where: { id: mapping.menu_id } }
        );
      }
    } 
    else if (ingredient.available && !wasAvailable) {
      for (const mapping of mappings) {
        const menuMappings = await MenuIngredientsMapping.findAll({
          where: { menu_id: mapping.menu_id },
          include: [{ model: Ingredients, as: 'ingredient' }]
        });
        
        const allAvailable = menuMappings.every(m => m.ingredient.available);
        if (allAvailable) {
          await Menu.update(
            { available: true },
            { where: { id: mapping.menu_id } }
          );
        }
      }
    }

    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const ingredient = await Ingredients.findByPk(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    
    await ingredient.destroy();
    res.json({ message: 'Ingredient deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;


/**
 * @swagger
 * /api/ingredients:
 *   post:
 *     summary: Create new ingredient
 *     tags: [Ingredients]
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
 *             properties:
 *               name:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Ingredient created
 *       400:
 *         description: Name required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *   get:
 *     summary: Get all ingredients
 *     tags: [Ingredients]
 *     responses:
 *       200:
 *         description: List of all ingredients
 */

/**
 * @swagger
 * /api/ingredients/{id}:
 *   get:
 *     summary: Get ingredient by ID
 *     tags: [Ingredients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Ingredient found
 *       404:
 *         description: Ingredient not found
 *   put:
 *     summary: Toggle ingredient availability
 *     tags: [Ingredients]
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
 *         description: Availability toggled
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Ingredient not found
 *   delete:
 *     summary: Delete ingredient
 *     tags: [Ingredients]
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
 *         description: Ingredient deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Ingredient not found
 */
