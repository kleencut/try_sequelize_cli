'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addColumn('Tasks','user_id',{
      type: Sequelize.INTEGER,
      allowNull:false
    })
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Tasks', 'user_id')
  }
};
