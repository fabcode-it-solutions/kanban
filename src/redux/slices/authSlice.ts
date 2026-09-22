import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AuthState } from "@/types/authState";
import { User } from "@/types/user";
import { signOut } from "next-auth/react";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

export const registerUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string }, // input type
  { rejectValue: string }
>("auth/registerUser", async (formData, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    return data.data; // consistent API
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (formData, { rejectWithValue }) => {
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    return data.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const logoutFromApp = createAsyncThunk("auth/logout", async () => {
  await signOut({ redirect: false });
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser(state) {
      state.user = null;
      state.error = null;
      state.loading = false;

    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed";
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      });

    // Logout
    builder.addCase(logoutFromApp.fulfilled, (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
    });
  },
});

export const { logoutUser } = authSlice.actions;
export default authSlice.reducer;
