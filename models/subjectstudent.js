'use strict';
module.exports = function(sequelize, DataTypes) {
  var SubjectStudent = sequelize.define('SubjectStudent', {
    SubjectId: DataTypes.INTEGER,
    StudentId: DataTypes.INTEGER,
    score: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  SubjectStudent.associate = function (models) {
    SubjectStudent.belongsTo(models.Subjects)
    SubjectStudent.belongsTo(models.Student)
  }
  return SubjectStudent;
};