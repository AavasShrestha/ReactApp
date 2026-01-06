// src/pages/Database/DatabasePage.tsx
import { useEffect, useState } from "react";
import { databaseService } from "../../services/Database/registerDbService";
import { Database } from "../../types";
import DatabaseFormDialog from "../DataBase/DatabaseFormDialog";
import EditDatabaseDialog from "../DataBase/EditDatabaseDialog";
import { Pencil, Trash2 } from "lucide-react";

export default function DatabasePage() {
  const [databases, setDatabases] = useState<Database[]>([]);
  const [loading, setLoading] = useState(true);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedDb, setSelectedDb] = useState<Database | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await databaseService.getAll();
      setDatabases(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (db: Database) => {
    setSelectedDb(db);
    setOpenEdit(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this database?")) return;
    try {
      await databaseService.delete(id);
      setDatabases(databases.filter(db => db.Id !== id)); // remove from UI immediately
    } catch (err: any) {
      alert("Delete failed: " + (err.response?.data?.Message || err.message || "Unknown error"));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 bg-red-500 text-center p-5 ">Database (Under Construction)</h1>

      <button
        className="mb-4 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        onClick={() => setOpenCreate(true)}
      >
        + New Database
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">SN</th>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Project</th>
                <th className="p-2 border">Database</th>
                <th className="p-2 border">Is Active</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {databases.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center p-4">No databases found</td>
                </tr>
              )}
              {databases.map((db, index) => (
                <tr key={db.Id} className="hover:bg-gray-50 transition">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{db.Id}</td>
                  <td className="p-2 border">{db.Project_name}</td>
                  <td className="p-2 border">{db.Db_name}</td>
                  
                  {/* Active pill */}
                  <td className="p-2 border">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      db.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {db.isActive ? "Yes" : "No"}
                    </span>
                  </td>

                  {/* Action icons */}
                  <td className="p-2 border flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handleEdit(db)}
                      className="p-1 rounded hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(db.Id)}
                      className="p-1 rounded hover:bg-red-100 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Dialog */}
      <DatabaseFormDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={loadData}
      />

      {/* Edit Dialog */}
      {selectedDb && (
        <EditDatabaseDialog
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          onSuccess={loadData}
          db={selectedDb}
        />
      )}
    </div>
  );
}
