'use client';
import * as Dialog from '@radix-ui/react-dialog';
import { ReactNode } from 'react';

interface UserModalWrapperProps {
    title: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: ReactNode;
}

export const UserModalWrapper = ({ title, open, onOpenChange, children }: UserModalWrapperProps) => (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
        <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
            <Dialog.Content className="fixed top-[50%] left-[50%] w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-md shadow-lg">
                <Dialog.Title className="text-xl font-semibold mb-4">{title}</Dialog.Title>
                {children}
                <Dialog.Close className="absolute top-3 right-3 text-gray-500 hover:text-black">&times;</Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);
