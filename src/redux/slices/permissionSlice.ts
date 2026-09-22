import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface Permission {
  id: number;
  name: string;
  description?: string;
}

interface PermissionState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
}

const initialState: PermissionState = {
  permissions: [],
  loading: false,
  error: null,
};

export const fetchPermissions = createAsyncThunk("permissions/fetch", async () => {
  const res = await fetch(`/api/admin/permissions?page=1&limit=10`);
  const { data, meta } = await res.json();
  return data;
});

export const createNewPermission = createAsyncThunk(
  "permissions/create",
  async (payload: { name: string; description?: string }) => {
    const res = await fetch("/api/admin/permissions", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data.data;
  }
);

export const updatePermission = createAsyncThunk(
  "permissions/update",
  async (payload: { id: number; name: string; description?: string }) => {
    const res = await fetch(`/api/admin/permissions/${payload.id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    return data.data;
  }
);

export const deletePermission = createAsyncThunk(
  "permissions/delete",
  async (id: number) => {
    await fetch(`/api/admin/permissions/${id}`, { method: "DELETE" });
    return id;
  }
);

const permissionSlice = createSlice({
  name: "permissions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.permissions = action.payload;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch permissions";
      })

      .addCase(createNewPermission.fulfilled, (state, action) => {
        state.permissions.push(action.payload);
      })

      .addCase(updatePermission.fulfilled, (state, action) => {
        const index = state.permissions.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.permissions[index] = action.payload;
      })

      .addCase(deletePermission.fulfilled, (state, action) => {
        state.permissions = state.permissions.filter(p => p.id !== action.payload);
      });
  },
});

export default permissionSlice.reducer;
