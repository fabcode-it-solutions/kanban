'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
    fetchUsers,
    deleteUserThunk,
} from '@/redux/slices/adminUsersSlice';
import { CreateUserModal } from '@/components/admin/modals/CreateUserModal';
import { EditUserModal } from '@/components/admin/modals/EditUserModal';
import { DeleteUserModal } from '@/components/admin/modals/DeleteUserModal';
import AssignRoleModal from '@/components/admin/modals/AssignRoleModal';
import { User } from '@/types/user';

export default function AdminUsersPageComponent() {
    const dispatch = useAppDispatch();
    const { users, loading, error, successMessage } = useAppSelector((state) => state.adminUsers);

    const [page, setPage] = useState(1);
    const [showCreate, setShowCreate] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);
    const [assignRoleModal, setAssignRoleModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });

    // Fetch users when page changes
    useEffect(() => {
        dispatch(fetchUsers({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleDelete = async (user: User) => {
        try {
            await dispatch(deleteUserThunk(user.id)).unwrap();
        } catch (err: any) {
            console.error("Delete failed:", err.message);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users Management</h1>
                <button
                    onClick={() => setShowCreate(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    + Create User
                </button>
            </div>

            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {loading ? (
                <p>Loading users...</p>
            ) : users.length === 0 ? (
                <p>No users found.</p>
            ) : (
                <table className="w-full table-auto border">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Email</th>
                            <th className="p-2 border">Roles</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="p-2 border">{user.name}</td>
                                <td className="p-2 border">{user.email}</td>
                                <td className="p-2 border">{user.roles?.join(', ') || '—'}</td>
                                <td className="p-2 border space-x-2">
                                    <button onClick={() => setEditingUser(user)} className="text-blue-600">
                                        Edit
                                    </button>
                                    <button onClick={() => setDeletingUser(user)} className="text-red-600">
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setAssignRoleModal({ open: true, user })}
                                        className="text-green-600"
                                    >
                                        Assign Role
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* Pagination */}
            <div className="mt-6 flex justify-between">
                <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 bg-gray-200 rounded"
                >
                    Next
                </button>
            </div>

            {/* Modals */}
            <CreateUserModal open={showCreate} onClose={() => setShowCreate(false)} />

            {editingUser && (
                <EditUserModal
                    open={!!editingUser}
                    onClose={() => setEditingUser(null)}
                    user={editingUser}
                />
            )}

            {deletingUser && (
                <DeleteUserModal
                    open={!!deletingUser}
                    onClose={() => setDeletingUser(null)}
                    userId={deletingUser.id}
                />
            )}

            {assignRoleModal.open && assignRoleModal.user && (
                <AssignRoleModal
                    open={assignRoleModal.open}
                    user={assignRoleModal.user}
                    onClose={() => setAssignRoleModal({ open: false, user: null })}
                />
            )}
        </div>
    );
}
