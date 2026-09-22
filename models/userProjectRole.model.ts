import sequelize from '../config/database';

export const UserProjectRole = sequelize.define('UserProjectRole', {}, { timestamps: false });