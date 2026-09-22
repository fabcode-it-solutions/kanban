'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { createUserThunk } from '@/redux/slices/adminUsersSlice';
import { UserModalWrapper } from './UserModalWrapper';

export const CreateUserModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = async () => {
        await dispatch(createUserThunk(formData));
        onClose();
    };

    return (
        <UserModalWrapper title="Create New User" open={open} onOpenChange={onClose}>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
                className="space-y-4"
            >
                <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full border p-2" />
                <input type="email" placeholder="Email" required value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="w-full border p-2" />
                <input type="password" placeholder="Password" required value={formData.password} onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))} className="w-full border p-2" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create</button>
            </form>
        </UserModalWrapper>
    );
};
