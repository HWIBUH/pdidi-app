'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ingredients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ingredients.hasMany(models.MenuIngredientsMapping, {
        foreignKey: 'ingredients_id',
        as: 'menus'
      });
    }
  }
  Ingredients.init({
    name: DataTypes.STRING,
    available: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ingredients',
  });
  return Ingredients;
};