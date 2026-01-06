import React from "react";
import { User } from "../../types";
import { Pencil, Trash2 } from "lucide-react";

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
            <table className="w-full border-collapse text-sm">
                {/* ---- Table Header ---- */}
                <thead>
                    <tr className="bg-gray-100 text-left text-gray-700">
                        <th className="p-3">ID</th>
                        <th className="p-3">Username</th>
                        <th className="p-3">Full Name</th>
                        <th className="p-3">Email</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Branch</th>
                        <th className="p-3">Active</th>
                        <th className="p-3 text-center">Actions</th>
                    </tr>
                </thead>

                {/* ---- Table Body ---- */}
                <tbody>
                    {users.length === 0 ? (
                        <tr>
                            <td colSpan={8} className="text-center p-4 text-gray-500">
                                No users found.
                            </td>
                        </tr>
                    ) : (
                        users.map((user) => (
                            <tr
                                key={user.Id}
                                className="border-b hover:bg-gray-50 transition-colors"
                            >
                                <td className="p-3">{user.Id}</td>
                                <td className="p-3">{user.Username}</td>
                                <td className="p-3">{user.FullName}</td>
                                <td className="p-3">{user.Email ?? "-"}</td>
                                <td className="p-3">{user.CompanyName ?? "-"}</td>
                                <td className="p-3">{user.BranchName ?? "-"}</td>

                                {/* Active/Inactive pill */}
                                <td className="p-3">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                                            user.IsActive
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {user.IsActive ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                {/* Action buttons with icons */}
                                <td className="p-3 text-center flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="p-1 rounded hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800"
                                        title="Edit"
                                    >
                                        <Pencil size={18} />
                                    </button>

                                    <button
                                        onClick={() => onDelete(user.Id)}
                                        className="p-1 rounded hover:bg-red-100 text-red-600 hover:text-red-800"
                                        title="Delete"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UserList;
