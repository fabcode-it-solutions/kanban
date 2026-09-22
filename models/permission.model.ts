import { DataTypes } from 'sequelize';
import sequelize from '../config/database';

export const Permission = sequelize.define('Permission', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  action: { type: DataTypes.STRING, allowNull: false },
  resource: { type: DataTypes.STRING, allowNull: false },
});
