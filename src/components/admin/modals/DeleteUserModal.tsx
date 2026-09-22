'use client';
import { useAppDispatch } from '@/redux/hooks';
import { deleteUserThunk } from '@/redux/slices/adminUsersSlice';
import { UserModalWrapper } from './UserModalWrapper';

export const DeleteUserModal = ({ open, onClose, userId }: { open: boolean; onClose: () => void; userId: number }) => {
    const dispatch = useAppDispatch();

    const handleDelete = async () => {
        await dispatch(deleteUserThunk(userId));
        onClose();
    };

    return (
        <UserModalWrapper title="Confirm Delete" open={open} onOpenChange={onClose}>
            <div className="space-y-4">
                <p>Are you sure you want to delete this user?</p>
                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Delete</button>
                </div>
            </div>
        </UserModalWrapper>
    );
};
