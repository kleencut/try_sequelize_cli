'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.addConstraint('Tasks', ['user_id'], {
      type: 'FOREIGN KEY',
      name: 'task_user_fk',
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: (queryInterface, Sequelize) => {
    queryInterface.removeConstraint('Tasks','task_user_fk')
  }
}
