'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Discounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      discountRate: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false
      },
      slotQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      slotsUsed: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      validUntil: {
        type: Sequelize.DATE,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Discounts');
  }
};