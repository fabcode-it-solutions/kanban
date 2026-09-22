"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchPermissions,
    createNewPermission,
    updatePermission,
    deletePermission,
} from "@/redux/slices/permissionSlice";

export default function PermissionsPage() {
    const dispatch = useAppDispatch();
    const { permissions, loading } = useAppSelector((state) => state.permissions);

    console.log({ permissions });


    const [form, setForm] = useState({ id: null, name: "", description: "" });

    useEffect(() => {
        dispatch(fetchPermissions());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.id) {
            dispatch(updatePermission(form as any));
        } else {
            dispatch(createNewPermission(form));
        }
        setForm({ id: null, name: "", description: "" });
    };

    const handleEdit = (perm: any) => setForm(perm);
    const handleDelete = (id: number) => dispatch(deletePermission(id));

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Permissions</h2>
            <form onSubmit={handleSubmit} className="mb-4 space-y-2">
                <input
                    type="text"
                    value={form.name}
                    placeholder="Permission name"
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="border p-2 w-full"
                    required
                />
                <textarea
                    value={form.description}
                    placeholder="Description"
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="border p-2 w-full"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    {form.id ? "Update" : "Create"}
                </button>
            </form>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul className="space-y-2">
                    {permissions.map((perm) => (
                        <li key={perm.id} className="border p-2 rounded flex justify-between">
                            <div>
                                <p className="font-medium">{perm.name}</p>
                                <p className="text-sm text-gray-600">{perm.description}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => handleEdit(perm)}
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(perm.id)}
                                    className="text-red-500 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
