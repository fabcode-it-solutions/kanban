import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchRoles = createAsyncThunk("roles/fetchAll", async () => {
  const res = await fetch("/api/admin/roles");
  return await res.json();
});

export const createRole = createAsyncThunk(
  "roles/create",
  async (name: string, { rejectWithValue }) => {
    const res = await fetch("/api/admin/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    if (!res.ok) return rejectWithValue(data.error);
    return data.role;
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: [] as { id: number; name: string }[],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      });
  },
});

export default roleSlice.reducer;
