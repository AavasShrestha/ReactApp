import { useState } from "react";
import { NewDatabase } from "../../types";
import { databaseService } from "../../services/Database/registerDbService";

export default function DatabaseFormDialog({ open, onClose, onSuccess }: any) {
    const [form, setForm] = useState<NewDatabase>({
        Project_name: "",
        Db_name: "",
        isActive: true,
    });

    const handleSubmit = async () => {
        // Validate fields before sending
        if (!form.Project_name.trim() || !form.Db_name.trim()) {
            alert("Project name and Database name are required.");
            return;
        }

        try {
            // Convert to FormData since backend expects [FromForm]
            const formData = new FormData();
            formData.append("Project_name", form.Project_name);
            formData.append("Db_name", form.Db_name);
            formData.append("isActive", form.isActive.toString());

            await databaseService.create(formData); // send FormData
            onSuccess(); // reload table
            onClose();
        } catch (err: any) {
            alert(err.response?.data?.Message || err.message || "Create failed");
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="font-bold text-lg mb-3">Create New Database</h2>

                <input
                    className="w-full border p-2 mb-2"
                    placeholder="Project Name"
                    value={form.Project_name}
                    onChange={(e) => setForm({ ...form, Project_name: e.target.value })}
                />

                <input
                    className="w-full border p-2 mb-2"
                    placeholder="Database Name"
                    value={form.Db_name}
                    onChange={(e) => setForm({ ...form, Db_name: e.target.value })}
                />

                <label className="flex items-center space-x-2 mb-2">
                    <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    />
                    <span>Active</span>
                </label>

                <div className="flex justify-end space-x-2">
                    <button
                        className="bg-blue-600 text-white px-3 py-2 rounded"
                        onClick={handleSubmit}
                    >
                        Save
                    </button>
                    <button
                        className="bg-gray-400 text-white px-3 py-2 rounded"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
