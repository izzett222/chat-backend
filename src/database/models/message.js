import Sequelize from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    sender: DataTypes.STRING,
    receiver: DataTypes.STRING,
    message: DataTypes.STRING,
  });

  Message.associate = () => {};

  return Message;
};
