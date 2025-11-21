import React from "react";
import { User } from "../../types";


// interface for userlist component 
// users: array of user objects fetched form backend
// onEdit: function triggered when user clicks Edit, onDelet: function triggered when user clicks Delete

interface UserListProps {
    users: User[];
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}

// userList component
// Display all the users in a simple, responsive table
// provides edit and delete actions for each user

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete }) => {


    return (

        <div className="overflow-x-auto bg-white rounded-xl shadow-md p-4">
            <table className="w-full border-collapse">
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
                        // If there are no users, show a friendly message
                        <tr>
                            <td colSpan={8} className="text-center p-4 text-gray-500">
                                No users found.
                            </td>
                        </tr>
                    ) : (

                        // Loop through users and display each one
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

                                {/* Conditional rendering for active/inactive */}
                                <td className="p-3">
                                    {user.IsActive ? (
                                        <span className="text-green-600 font-medium">Active</span>
                                    ) : (
                                        <span className="text-red-600 font-medium">Inactive</span>
                                    )}
                                </td>

                                {/* Action buttons */}
                                <td className="p-3 text-center space-x-2">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => onEdit(user)}
                                        className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500"
                                    >
                                        Edit
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                        onClick={() => onDelete(user.Id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                                    >
                                        Delete
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