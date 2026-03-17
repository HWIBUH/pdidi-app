'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    }
  }
  Discount.init({
    discountRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    slotQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    slotsUsed: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    validUntil: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Discount',
  });
  return Discount;
};