module.exports = function(sequelize, DataTypes) {
  return(sequelize.define('tag', {
    tag: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Tag is required'
        }
      }
    },
  
  }, {
    defaultScope: {
      order: [['createdAt', 'DESC']]
    },
    classMethods: {
      associate: function(models) {
        models.tag.belongsTo(models.imagepost);
        models.tag.belongsTo(models.user);

      }
    },
      // findWithImagepostId: function(imagepostId) {
      //        return(this.findAll({
      //          where: {
      //            Id: imagepostId
      //          },
      //          include: [
      //           // sequelize.models.user,
      //            sequelize.models.imagepost
      //          ],
      //          order: [
      //            [sequelize.models.comment, 'createdAt', 'DESC']
      //          ]
      //        }));
      //      } 



    ///
  }));

}; 
