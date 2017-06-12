
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
					msg: 'Pic Story is required'
				},
				len:{
					args: [0,50],
					msg:  'Pic Story cannot be greater than 150 charcters'
				}

			}
		},
	
		// imageFilename: {
		// 	type:         DataTypes.STRING,
		// 	allowNull:    false,
		// 	defaultValue: '',
		// 	validate: {
		// 		notEmpty: {
		// 			msg: 'Image is required'
		// 		}
		// 	}


		//arn:aws:s3:::pictori
		// }
	},
	{
		defaultScope: {
			order: [['createdAt', 'DESC']]
		},
	  getterMethods: {
			url: function() {
				return('/');
			},
			imageUrl: function() {
				return(`https://s3.us-east-2.amazonaws.com/pictori/imageposts/${this.id}`);
				 // https://s3.us-east-2.amazonaws.com/pictori/imageposts/49
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

