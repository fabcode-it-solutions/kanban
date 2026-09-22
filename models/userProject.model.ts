import sequelize from '../config/database';

export const UserProject = sequelize.define('UserProject', {}, { timestamps: false });