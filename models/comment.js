module.exports = function(sequelize, DataTypes) {
  return(sequelize.define('comment', {
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
    author: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Author is required'
        }
      }
    },
  }, {
    defaultScope: {
      order: [['createdAt', 'DESC']]
    },
    classMethods: {
      associate: function(models) {
        models.comment.belongsTo(models.imagepost);
      }
    },
      findWithImagepostId: function(imagepostId) {
             return(this.findAll({
               where: {
                 Id: imagepostId
               },
               include: [
                // sequelize.models.user,
                 sequelize.models.imagepost
               ],
               order: [
                 [sequelize.models.comment, 'createdAt', 'DESC']
               ]
             }));
           } 



    ///
  }));

}; 
