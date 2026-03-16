require('dotenv').config();
const express = require('express');
const cors = require('cors')
const { connectDB } = require("./database/database.js");
const { swaggerUi, specs } = require('./swagger.js');
const cookieParser = require('cookie-parser');


const app = express();
const port = 3000;

connectDB();

app.use(cors({
  origin: process.env.ORIGIN_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js')
const menuRoutes = require('./routes/menu.js')
const ingredientRoutes = require('./routes/ingredients.js')
const menuIngredientsRoutes = require('./routes/menuingredientsmapping.js');
const orderRoutes = require('./routes/order.js');
const balanceRoutes = require('./routes/balance.js');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes)
app.use('/api/ingredients', ingredientRoutes)
app.use('/api/menu-ingredients', menuIngredientsRoutes);
app.use('/api/order', orderRoutes)
app.use('/api/balance', balanceRoutes)


if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
app.get('/', (req, res) => {
    if (process.env.NODE_ENV === 'development') {
        return res.redirect('/api-docs');
    }
    res.send('Catering API');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});