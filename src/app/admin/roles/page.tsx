"use client";

import { Key, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRoles } from "@/redux/slices/roleSlice";

export default function ListRoles() {
    const dispatch = useAppDispatch();
    const { roles, loading, error } = useAppSelector((state) => state.roles);

    useEffect(() => {
        dispatch(fetchRoles());
    }, [dispatch]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Verified Users</h1>

            {loading && <p>Loading users...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {roles.length === 0 && !loading && <p>No Verified roles found.</p>}

            {roles.map((role: { id: Key, name: string }) => (
                <div
                    key={role.id}
                    className="p-4 mb-4 border rounded shadow-sm bg-white"
                >
                    <div className="mb-2">
                        <strong>{role.name}</strong>
                    </div>
                </div>
            ))}
        </div>
    );
}
