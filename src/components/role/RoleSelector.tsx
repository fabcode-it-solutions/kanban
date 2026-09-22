"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles, createRole } from "@/redux/slices/roleSlice";
import { AppDispatch, RootState } from "@/redux/store";

type Props = {
  onRoleSelect: (roleId: number) => void;
};

export default function RoleSelector({ onRoleSelect }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { roles, loading } = useSelector((state: RootState) => state.roles);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleCreateRole = async () => {
    if (!newRole.trim()) return;
    const result = await dispatch(createRole(newRole));
    if (createRole.fulfilled.match(result)) {
      onRoleSelect(result.payload.id);
      setNewRole("");
    }
  };

  return (
    <div className="space-y-2">
      <select
        onChange={(e) => onRoleSelect(Number(e.target.value))}
        className="w-full border p-2 rounded"
      >
        <option value="">Select Role</option>
        {roles.map((role) => (
          <option key={role.id} value={role.id}>
            {role.name}
          </option>
        ))}
      </select>

      <div className="flex gap-2">
        <input
          type="text"
          value={newRole}
          onChange={(e) => setNewRole(e.target.value)}
          placeholder="New Role Name"
          className="flex-grow border p-2 rounded"
        />
        <button
          type="button"
          onClick={handleCreateRole}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Create
        </button>
      </div>
    </div>
  );
}
