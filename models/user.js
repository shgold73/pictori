module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    email: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'Email is not a valid email address'
        },
        isUnique: function(value, next) {
          var self = this;

          User.findOne({
            where: {
              email: value
            }
          }).then(function(user) {
            if (user && user.id != self.id)
              return(next('Email is already registered'));
            else
              return(next());
          });
        }
      }
    },
    password: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [{min: 8}],
          msg: 'Password must be at least 8 characters'
        }
      }
    },
    firstname:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'First Name is required'
        }
      }
    },
    lastname: {
      type:      DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Last Name is required'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // cd 
      }
    }
  })

  return(User);
};