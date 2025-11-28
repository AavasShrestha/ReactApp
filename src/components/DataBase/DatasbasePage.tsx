// src/pages/Database/DatabasePage.tsx
import { useEffect, useState } from "react";
import { databaseService } from "../../services/Database/registerDbService";
import { Database } from "../../types";
import DatabaseFormDialog from "../DataBase/DatabaseFormDialog";
import EditDatabaseDialog from "../DataBase/EditDatabaseDialog";

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
      <h1 className="text-2xl font-bold mb-4">Databases</h1>

      <button
        className="mb-4 bg-blue-600 text-white px-3 py-2 rounded"
        onClick={() => setOpenCreate(true)}
      >
        + New Database
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border">
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
              <tr key={db.Id} className="hover:bg-gray-50">
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{db.Id}</td>
                <td className="p-2 border">{db.Project_name}</td>
                <td className="p-2 border">{db.Db_name}</td>
                <td className="p-2 border">{db.isActive ? "Yes" : "No"}</td>
                <td className="p-2 border space-x-2">
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => handleEdit(db)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(db.Id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
