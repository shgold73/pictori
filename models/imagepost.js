
module.exports = function(sequelize, DataTypes) {
	return(sequelize.define('imagepost', {
		title: {
			type:      DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Title is required'
				}
			}
		},
		body: {
			type:      DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Body is required'
				}
			}
		},
	
		imageFilename: {
			type:         DataTypes.STRING,
			allowNull:    false,
			defaultValue: '',
			validate: {
				notEmpty: {
					msg: 'Image is required'
				}
			}
		}
	}, {
		defaultScope: {
			order: [['createdAt', 'DESC']]
		},
	  getterMethods: {
			url: function() {
				return('/');
			},
			imageUrl: function() {
				return(`/images/imageposts/${this.imageFilename}`);
			},
			imageThumbnailUrl: function() {
				return(`${this.imageUrl}-thumbnail`);
			}

	  },
		classMethods: {
      		associate: function(models) {
        		//models.imagepost.belongsTo(models.user);
        		models.imagepost.hasMany(models.comment);
       		},
		findWithImagepostId: function(imagepostId) {
				return(this.findAll({
					where: {
						imagepostId: imagepostId
					},
					include: [
						sequelize.models.user,
						sequelize.models.comment
					],
					order: [
						[sequelize.models.comment, 'createdAt', 'DESC']
					]
				}));
			}
		}	
	}));

};