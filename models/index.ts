// Folder: /models/index.ts
import { User } from './user.model';
import { Role } from './role.model';
import { Project } from './project.model';
import { Permission } from './permission.model';
import { UserProject } from './userProject.model';
import { RolePermission } from './rolepermission.model';
import { UserProjectRole } from './userProjectRole.model';

// Define associations
User.belongsToMany(Project, { through: UserProject });
Project.belongsToMany(User, { through: UserProject });

Role.belongsToMany(Permission, { through: RolePermission });
Permission.belongsToMany(Role, { through: RolePermission });

User.belongsToMany(Role, { through: UserProjectRole });
Role.belongsToMany(User, { through: UserProjectRole });

Project.belongsToMany(Role, { through: UserProjectRole });
Role.belongsToMany(Project, { through: UserProjectRole });

export {
  User,
  Role,
  Project,
  Permission,
  UserProject,
  RolePermission,
  UserProjectRole,
};
