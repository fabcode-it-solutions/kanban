"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    approveAndAssignRole,
    fetchUnverifiedUsers,
} from "@/redux/slices/adminUsersSlice";
import RoleSelector from "@/components/role/RoleSelector";

export default function AdminUsersPage() {
    const dispatch = useAppDispatch();
    const [roleId, setRoleId] = useState<number>();
    const { users, loading, error } = useAppSelector((state) => state.adminUsers);

    useEffect(() => {
        dispatch(fetchUnverifiedUsers());
    }, [dispatch]);

    const handleApprove = (userId: number, roleId: number) => {
        dispatch(approveAndAssignRole({ userId, roleId }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Unverified Users</h1>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {users.length === 0 && !loading && <p>No unverified users found.</p>}

            {users.map((user) => (
                <div
                    key={user.id}
                    className="p-4 mb-4 border rounded shadow-sm bg-white"
                >
                    <div className="mb-2">
                        <strong>{user.name}</strong> ({user.email})
                    </div>
                    <RoleSelector onRoleSelect={(roleId) => setRoleId(roleId)} />
                    <button
                        onClick={() => {
                            if (roleId) handleApprove(user.id, roleId);
                        }}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        Approve
                    </button>
                </div>
            ))}
        </div>
    );
}
