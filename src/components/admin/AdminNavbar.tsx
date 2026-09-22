"use client";
import Link from "next/link";

export default function AdminNavbar() {
    return (
        <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
            <Link href="/admin">
                <div className="text-xl font-bold">Admin Panel</div>
            </Link>
            <div className="space-x-4">
                <Link href="/admin/users">Users</Link>
                <Link href="/admin/roles">Roles</Link>
                <Link href="/admin/projects">Projects</Link>
                <Link href="/dashboard" className="text-gray-300">Back to App</Link>
            </div>
        </nav>
    );
}
