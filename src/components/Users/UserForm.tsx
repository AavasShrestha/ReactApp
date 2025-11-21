import React, { useState, useEffect } from 'react'
import { User, NewUser } from '../../types'

/**
 * Props interface for UserForm
 * - user: if provided, the form is in "edit mode"
 * - onSubmit: function to handle submit (create or update)
 * - onClose: function to close the form
 **/

interface UserFormProps {
    user: User | null;
    onSubmit: (idOrData: number | NewUser, data?: NewUser) => void;
    onClose: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onClose }) => {
    //   Form state, initialoized with emppty or user data
    const [formData, setFormData] = useState<NewUser>
        (
            {
                Username: "",
                FullName: "",
                Email: "",
                Role: "",
                IsActive: true
            }
        );

    // if editing prefill the form
    useEffect(() => {
        if (user) {
            setFormData({
                Username: user.Username,
                FullName: user.FullName,
                Email: user.Email ?? "",
                Role: user.Role ?? "",
                IsActive: user.IsActive
            });
        }
    }, [user]);

    // Handle input changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const value =
            target.type === "checkbox" ? (target as HTMLInputElement).checked : target.value;
        const key = target.name as keyof NewUser;

        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };




    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            // Edit mode: pass ID and data
            onSubmit(user.Id, formData);
        } else {
            // Create mode: pass only data
            onSubmit(formData);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    {user ? "Edit User" : "New User"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block mb-1 font-medium">Username</label>
                        <input
                            type="text"
                            name="Username"
                            placeholder="Enter username"
                            value={formData.Username}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block mb-1 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="FullName"
                            value={formData.FullName}
                            placeholder="Enter username"
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            type="email"
                            name="Email"
                            placeholder="Enter username"
                            value={formData.Email}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* Role / Branch */}
                    <div>
                        <label className="block mb-1 font-medium">Role</label>
                        <input
                            type="text"
                            name="Role"
                            placeholder="Enter username"
                            value={formData.Role}
                            onChange={handleChange}
                            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    {/* IsActive Checkbox */}
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            name="IsActive"
                            id = "isActive"
                            checked={formData.IsActive}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label>Active</label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                        >
                            {user ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm