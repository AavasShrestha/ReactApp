import React, { useEffect, useState } from "react";
import { NewUser, User } from "../../types";
import { userService } from "../../services/user/userService";
import UserList from "./UserList";
import UserForm from "./UserForm";

const UserPage: React.FC = () => {
  // -----------------------------
  // Define state variables
  // -----------------------------
  const [users, setUsers] = useState<User[]>([]); // All users fetched from backend
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // User currently being edited
  const [isFormOpen, setIsFormOpen] = useState(false); // Show/hide form modal

  // -----------------------------
  // Fetch users from backend when page loads
  // -----------------------------
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users using userService
  const fetchUsers = async () => {
    try {
      const data = await userService.getAll(); // Backend call (GET /api/users)
      setUsers(data); // Update local state
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  // -----------------------------
  // Create new user
  // -----------------------------
  const handleCreate = async (data: NewUser) => {
    try {
      await userService.create(data); // POST request to backend
      await fetchUsers(); // Refresh list after successful creation
      setIsFormOpen(false); // Close modal
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  // -----------------------------
  // Update existing user
  // -----------------------------
  const handleUpdate = async (id: number, data: NewUser) => {
    try {
      await userService.update(id, data); // PUT request to backend
      await fetchUsers(); // Refresh data
      setSelectedUser(null);
      setIsFormOpen(false);
    } catch (err) {
      console.error("Failed to update user:", err);
    }
  };

  // -----------------------------
  //  Delete user
  // -----------------------------
  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await userService.delete(id); // DELETE request to backend
        await fetchUsers(); // Refresh list
      } catch (err) {
        console.error("Failed to delete user:", err);
      }
    }
  };

  // -----------------------------
  // Render UI
  // -----------------------------
  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">User Management</h1>

        {/* Button to create new user */}
        <button
          onClick={() => {
            setSelectedUser(null); // Reset selection
            setIsFormOpen(true); // Open form
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New User
        </button>
      </div>

      {/* User List Table */}
      <UserList
        users={users}
        onEdit={(user) => {
          setSelectedUser(user); // Load selected user data
          setIsFormOpen(true); // Open form in edit mode
        }}
        onDelete={handleDelete} // Handle delete
      />

      {/* User Form (Add/Edit) */}
      {isFormOpen && (
        <UserForm
          user={selectedUser} // Pass selected user for editing
          onClose={() => setIsFormOpen(false)} // Close modal
          onSubmit={selectedUser ? handleUpdate : handleCreate} // Decide create or update
        />
      )}
    </div>
  );
};

export default UserPage;
