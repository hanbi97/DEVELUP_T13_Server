//db table create

export const User = (sequelize, DataTypes) => {
  return sequelize.define('user', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "https://image.flaticon.com/icons/svg/42/42829.svg"
    },
    introduce: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    skill_types: {
      type: DataTypes.ENUM("Web-frontend","Web-backend","Server","Android","IOS"),
      allowNull: true
    },
    validation: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    key_for_verify: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });
};
