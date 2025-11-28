// src/pages/DataBase/EditDatabaseDialog.tsx
import { useState } from "react";
import { Database } from "../../types";
import { databaseService } from "../../services/Database/registerDbService";

export default function EditDatabaseDialog({ open, onClose, db, onSuccess }: any) {
    const [form, setForm] = useState<Partial<Database>>({
        Project_name: db.Project_name,
        Db_name: db.Db_name,
        isActive: db.isActive,
    });

    const handleUpdate = async () => {
        await databaseService.update(db.Id, form);
        onSuccess();
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white p-6 rounded w-96">
                <h2 className="font-bold text-lg mb-3">Edit Database</h2>

                <input
                    className="w-full border p-2 mb-2"
                    value={form.Project_name}
                    onChange={(e) => setForm({ ...form, Project_name: e.target.value })}
                />

                <input
                    className="w-full border p-2 mb-2"
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
                        onClick={handleUpdate}
                    >
                        Update
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
