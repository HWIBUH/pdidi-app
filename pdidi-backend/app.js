const express = require('express');
const { connectDB } = require("./database/database.js");
const { swaggerUi, specs } = require('./swagger.js');

const app = express();
const port = 3000;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js')
const menuRoutes = require('./routes/menu.js')
const ingredientRoutes = require('./routes/ingredients.js')
const menuIngredientsRoutes = require('./routes/menuingredientsmapping.js');
const orderRoutes = require('./routes/order.js');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes)
app.use('/api/ingredients', ingredientRoutes)
app.use('/api/menu-ingredients', menuIngredientsRoutes);
app.use('/api/order', orderRoutes)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.get('/', (req, res) => {
    res.send('API DOCUMENTATION FOR PDIDI WEB, dokumentasi di /api-docs ya');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});