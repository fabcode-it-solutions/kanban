import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { User } from './user.model';

export const Project = sequelize.define('Project', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  createdBy: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
});

Project.belongsTo(User, { as: 'creator', foreignKey: 'createdBy' });