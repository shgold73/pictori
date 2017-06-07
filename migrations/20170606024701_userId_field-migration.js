module.exports = {
  up: function (queryInterface, Sequelize) {
    return(queryInterface.addColumn('imageposts', 'userId', {
      type:         Sequelize.INTEGER,
      allowNull:    false,
      defaultValue: 1
    }));
  },

  down: function (queryInterface, Sequelize) {
    return(queryInterface.removeColumn('imageposts', 'userId'));
  }
};