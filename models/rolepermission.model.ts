import sequelize from '../config/database';

export const RolePermission = sequelize.define('RolePermission', {}, { timestamps: false });