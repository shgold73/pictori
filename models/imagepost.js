
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
				},
				len:{
					args: [1,150],
					msg:  'Comments cannot be greater than 150 charcters'
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
         		models.imagepost.belongsTo(models.user);
         		models.imagepost.hasMany(models.comment);
         		models.imagepost.hasMany(models.tag);
       },
   }
			
  

	}));

};

