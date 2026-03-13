# Backend API

Food ordering application backend built with Express.js, Sequelize, and MySQL.

## Prerequisites

- Node.js (v18+)
- MySQL (v8.0+)
- npm or yarn

## Installation

### 1. Navigate to the project directory
```bash
cd pdidi-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory. Use `.env.example` as a reference:

```bash
cp .env.example .env
```

Edit `.env` with your database and application settings:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dbname
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_secret_key_32_characters_or_more
```

### 4. Run database migrations
```bash
npx sequelize-cli db:migrate
```

### 5. Start the application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The API will be available at `http://localhost:3000`

## API Documentation

Once the server is running, visit the Swagger documentation:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/validate-admin` - Get admin token

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item
- `POST /api/menu` - Create menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Ingredients
- `GET /api/ingredients` - Get all ingredients
- `GET /api/ingredients/:id` - Get single ingredient
- `POST /api/ingredients` - Create ingredient (admin)
- `PUT /api/ingredients/:id` - Toggle availability (admin)
- `DELETE /api/ingredients/:id` - Delete ingredient (admin)

### Menu-Ingredients Mapping
- `GET /api/menu-ingredients` - Get all mappings
- `GET /api/menu-ingredients/menu/:menu_id` - Get ingredients for menu item
- `GET /api/menu-ingredients/ingredient/:ingredients_id` - Get menus with ingredient
- `POST /api/menu-ingredients` - Create mapping (admin)
- `DELETE /api/menu-ingredients/:mapping_id` - Remove mapping (admin)

### Orders
- `GET /api/order` - Get all orders (admin)
- `GET /api/order/:id` - Get order by ID
- `GET /api/order/user/:user_id` - Get user's orders
- `POST /api/order` - Create order
- `PUT /api/order/:id` - Update order (admin)
- `PATCH /api/order/:id/toggle` - Toggle order status (admin)
- `DELETE /api/order/:id` - Delete order (admin)

### Balance
- `GET /api/balance` - Get current balance
- `POST /api/balance` - Add to balance (admin)
- `POST /api/balance/subtract` - Subtract from balance (admin)

## Authentication

For protected endpoints, include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Project Structure

```
pdidi-backend/
├── models/          # Sequelize models
├── routes/          # API route handlers
├── middlewares/     # Custom middleware
├── migrations/      # Database migrations
├── app.js          # Express app setup
├── swagger.js      # Swagger documentation config
├── .env            # Environment variables
└── package.json    # Dependencies
```
