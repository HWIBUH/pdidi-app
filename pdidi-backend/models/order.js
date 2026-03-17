'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      
      Order.belongsTo(models.Menu, {
        foreignKey: 'menu_id',
        as: 'menu'
      });
    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    menu_id: DataTypes.INTEGER,
    done: DataTypes.BOOLEAN,
    total_price: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};