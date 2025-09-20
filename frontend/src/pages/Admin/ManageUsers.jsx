import React, { useEffect, useState } from "react";
import { userApi } from "../../api/userApi";
import { LoadingSpinner } from "../../components/Loader";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      setDeletingUser(userId);
      const response = await userApi.deleteUser(userId);
      if (response.success) {
        toast.success("User deleted successfully");
        setUsers(users.filter((u) => u._id !== userId));
      } else {
        toast.error(response.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setDeletingUser(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading users..." />;

  return (
    <div className="min-h-screen px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Users</h1>

      {users.length === 0 ? (
        <div className="text-gray-600">No users found.</div>
      ) : (
        <div className="bg-white shadow rounded-lg p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">Role</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.role}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingUser === user._id}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
