module.exports = {
  up: function(queryInterface, Sequelize) {
		return(queryInterface.createTable('imageposts', {
			id: {
				type:          Sequelize.INTEGER,
				primaryKey:    true,
				autoIncrement: true,
        allowNull:     false
			},
			title: {
	    	type:      Sequelize.STRING,
        allowNull: false
			},
			body: {
	    	type:      Sequelize.TEXT,
        allowNull: false
			},
			imageFilename: {
			type:         Sequelize.STRING,
			allowNull:    false,
			defaultValue: ''
			},	
			createdAt: {
	    	type:      Sequelize.DATE,
        allowNull: false
			},
			updatedAt: {
	    	type:      Sequelize.DATE,
        allowNull: false
			}
		}));
  },

  down: function(queryInterface, Sequelize) {
    return(queryInterface.dropTable('imageposts'));
  }
};