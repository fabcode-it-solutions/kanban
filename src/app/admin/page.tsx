// app/admin/page.tsx
import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <AdminCard title="All Users" href="/admin/users" />
        <AdminCard title="Unverified Users" href="/admin/unverified" />
        <AdminCard title="Roles" href="/admin/roles" />
        <AdminCard title="Permissions" href="/admin/permissions" />
        <AdminCard title="Projects" href="/admin/projects" />
      </div>
    </div>
  );
}

function AdminCard({ title, href }: { title: string; href: string }) {
  return (
    <Link href={href} className="p-4 rounded bg-white shadow hover:shadow-md transition">
      <h2 className="text-xl font-semibold">{title}</h2>
    </Link>
  );
}
