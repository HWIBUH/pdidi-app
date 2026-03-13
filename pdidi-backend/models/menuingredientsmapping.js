'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MenuIngredientsMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MenuIngredientsMapping.belongsTo(models.Menu, {
        foreignKey: 'menu_id',
        as: 'menu'
      });
      
      MenuIngredientsMapping.belongsTo(models.Ingredients, {
        foreignKey: 'ingredients_id',
        as: 'ingredient'
      });
    }
  }
  MenuIngredientsMapping.init({
    menu_id: DataTypes.INTEGER,
    ingredients_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'MenuIngredientsMapping',
  });
  return MenuIngredientsMapping;
};