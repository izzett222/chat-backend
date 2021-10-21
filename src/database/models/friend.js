module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define('Friend', {
    sender: DataTypes.STRING,
    receiver: DataTypes.STRING,
    status: DataTypes.STRING,
  });

  Friend.associate = () => {};

  return Friend;
};
