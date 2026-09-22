'use client';
import AsyncCreatableSelect from 'react-select/async-creatable';
import { useState } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { assignRolesThunk } from '@/redux/slices/adminUsersSlice';
import { UserModalWrapper } from './UserModalWrapper';
import { User } from '@/types/user';

interface Option { label: string; value: string; __isNew__?: boolean }

export default function AssignRoleModal({
    open,
    onClose,
    user,
}: {
    open: boolean;
    onClose: () => void;
    user: User;
}) {
    const dispatch = useAppDispatch();
    const [selectedOptions, setSelectedOptions] = useState<Option[]>([]);

    const loadOptions = async (inputValue: string) => {
        const res = await fetch(`/api/admin/roles?search=${inputValue}`);
        const { data } = await res.json();
        if (!res.ok) {
            throw new Error(data.error || "Failed to fetch roles");
        }

        return data.map((r: any) => ({ value: r.id.toString(), label: r.name }));
    };

    const handleSubmit = async () => {
        const roleNames = selectedOptions.map((opt) =>
            opt.__isNew__ || !opt.value ? opt.label : undefined
        ).filter(Boolean) as string[];

        const roleIds = selectedOptions
            .filter((opt) => !opt.__isNew__ && opt.value)
            .map((opt) => Number(opt.value));

        await dispatch(assignRolesThunk({ userId: user.id, roleNames, roleIds }));
        onClose();
    };

    return (
        <UserModalWrapper title={`Assign Roles to ${user.name}`} open={open} onOpenChange={onClose}>
            <AsyncCreatableSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                onChange={(opts) => setSelectedOptions(opts as Option[])}
                formatCreateLabel={(input) => `Create new role: "${input}"`}
            />
            <button onClick={handleSubmit} className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
                Save Roles
            </button>
        </UserModalWrapper>
    );
}
