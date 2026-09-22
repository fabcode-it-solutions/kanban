// app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { redirect } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminFooter from "@/components/admin/AdminFooter";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    const roles = session?.user?.roles || [];
    const isAdmin = roles.includes("admin");

    if (!isAdmin) {
        return redirect("/dashboard");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <AdminNavbar />
            <main className="flex-grow bg-gray-100 p-4">{children}</main>
            <AdminFooter />
        </div>
    );
}
