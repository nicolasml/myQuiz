// Definición de tablas por ORM
module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Quiz',
    { pregunta: DataTypes.STRING,
      respuesta: DataTypes.STRING
    });
}