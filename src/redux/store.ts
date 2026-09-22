// src/redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import adminUsersReducer from "./slices/adminUsersSlice";
import rolesReducer from "./slices/roleSlice";
import permissionsReducer from "./slices/permissionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    adminUsers: adminUsersReducer,
    roles: rolesReducer,
    permissions: permissionsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
