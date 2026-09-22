import { User } from "@/types/user";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// --- Types ---
interface AdminUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null,
  successMessage: null,
};

// --- Async Thunks ---
export const fetchUnverifiedUsers = createAsyncThunk(
  "admin/fetchUnverifiedUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/unverified-users");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");
      return data.users;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async ({ page, limit }: { page: number, limit: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/users?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch users");

      return data.users;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const approveAndAssignRole = createAsyncThunk(
  "admin/approveAndAssignRole",
  async (payload: { userId: number; roleId: number }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/verify-user/${payload.userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to approve user");
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const assignRolesThunk = createAsyncThunk(
  "admin/assignRoles",
  async ({
    userId,
    roleNames,
    roleIds,
  }: { userId: number; roleNames: string[]; roleIds: number[] }, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/roles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleNames, roleIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign roles");
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);



export const createUserThunk = createAsyncThunk(
  "admin/createUser",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");
      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateUserThunk = createAsyncThunk(
  "admin/updateUser",
  async (
    payload: { id: number; data: Partial<User> },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`/api/admin/users/${payload.id}`, {
        method: "PUT",
        body: JSON.stringify(payload.data),
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to update user");
      return result.user;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  "admin/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// --- Slice ---
const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {
    clearMessages(state) {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Unverified Users
      .addCase(fetchUnverifiedUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUnverifiedUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUnverifiedUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Approve + Assign Role
      .addCase(approveAndAssignRole.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload.id);
        state.successMessage = "User approved and role assigned.";
      })

      // Create User
      .addCase(createUserThunk.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
        state.successMessage = "User created successfully.";
      })
      .addCase(createUserThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update User
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
        state.successMessage = "User updated successfully.";
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Delete User
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.successMessage = "User deleted successfully.";
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearMessages } = adminUsersSlice.actions;
export default adminUsersSlice.reducer;
