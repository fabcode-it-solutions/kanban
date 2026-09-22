import AdminUsersPageComponent from "@/components/admin/users/AdminUsersPage";

export default function AdminUsersPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      <AdminUsersPageComponent />
    </div>
  );
}
