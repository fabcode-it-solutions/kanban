'use client';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { updateUserThunk } from '@/redux/slices/adminUsersSlice';
import { UserModalWrapper } from './UserModalWrapper';
import { User } from '@/types/user';

export const EditUserModal = ({ open, onClose, user }: { open: boolean; onClose: () => void; user: User }) => {
    const dispatch = useAppDispatch();
    const [formData, setFormData] = useState({ name: user.name, email: user.email });

    const handleSubmit = async () => {
        await dispatch(updateUserThunk({
            id: user.id,
            data: formData
        }));
        onClose();
    };

    return (
        <UserModalWrapper title="Edit User" open={open} onOpenChange={onClose}>
            <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                <input type="text" required value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} className="w-full border p-2" />
                <input type="email" required value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} className="w-full border p-2" />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Update</button>
            </form>
        </UserModalWrapper>
    );
};
