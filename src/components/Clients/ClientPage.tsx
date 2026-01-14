import React, { useEffect, useState } from "react";
import { Client, NewClient } from "../../types";
import ClientForm from "./ClientForm";
import clientService from "../../services/Client/clientService";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClientPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewClient, setViewClient] = useState<Client | null>(null);
  const [menuClient, setMenuClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  // Databases array
  const [databases, setDatabases] = useState<string[]>([]);

  useEffect(() => {
    fetchClients();
    fetchDatabases();
  }, []);

  // Fetch clients
  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  // Fetch databases from backend
  const fetchDatabases = async () => {
    try {
      const res = await fetch("http://localhost:5114/api/Database");
      const data: string[] = await res.json();
      setDatabases(data);
    } catch (err) {
      console.error("Failed to fetch databases:", err);
    }
  };

  // View client
  const handleViewClick = (client: Client) => {
    setViewClient(client);
  };

  // Edit client
  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

  // Create client
  const handleCreate = async (data: NewClient & { logo?: File }) => {
    try {
      await clientService.create(data);
      fetchClients();
      setModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create client");
    }
  };

  // Update client
  const handleUpdate = async (id: number, data: NewClient & { logo?: File }) => {
    try {
      await clientService.update(id, data);
      fetchClients();
      setSelectedClient(null);
      setModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update client");
    }
  };

  // Delete client
  const handleDelete = async (id: number) => {
    const client = clients.find(c => c.client_id === id);
    if (!client) return;

    if (client.collection_app) {
      alert("This client is active. Please mark it as inactive before deleting.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this inactive client?")) return;

    try {
      await clientService.delete(id);
      fetchClients();
    } catch (err) {
      alert("Failed to delete client");
      console.error(err);
    }
  };

  // Close modals on ESC
  useEffect(() => {
    if (!modalOpen && !viewClient) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (modalOpen) setModalOpen(false);
        if (viewClient) setViewClient(null);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [modalOpen, viewClient]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="sticky top-0 bg-white z-20 flex justify-between items-center mb-4 border-b border-gray-200 p-4">
        <h1 className="text-2xl font-semibold">Clients List Table</h1>
        <button
          onClick={() => { setSelectedClient(null); setModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Client
        </button>
      </div>

      {/* Clients Table */}
      <div className="overflow-x-auto max-h-[600px] border border-gray-300 rounded">
        <table className="min-w-full bg-white text-sm table-fixed">
          <thead className="bg-gray-300 text-xs sticky top-0 z-10">
            <tr>
              <th className="py-2 px-4 w-10 text-left font-semibold text-gray-700">S.N.</th>
              <th className="py-2 px-4 w-32 text-left font-semibold text-gray-700">Name</th>
              <th className="py-2 px-4 w-32 text-left font-semibold text-gray-700">DB</th>
              <th className="py-2 px-4 w-40 text-left font-semibold text-gray-700">Address</th>
              <th className="py-2 px-4 w-16 text-left font-semibold text-gray-700">SMS</th>
              <th className="py-2 px-4 w-20 text-center font-semibold text-gray-700">isLive</th>
              <th className="py-2 px-4 w-20 text-center font-semibold text-gray-700">Approval</th>
              <th className="py-2 px-4 w-20 text-center font-semibold text-gray-700">Active</th>
              <th className="py-2 px-4 w-32 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {clients.length ? clients.map((c, i) => (
              <tr key={c.client_id} className="border-t hover:bg-gray-50 transition">
                <td className="py-1 px-2 text-left">{i + 1}</td>
                <td className="py-1 px-2 text-left">{c.client_name}</td>
                <td className="py-1 px-2 text-left">{c.db_name}</td>
                <td className="py-1 px-2 text-left">{c.address || "N/A"}</td>

                <td className="py-2 px-1 text-left">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${c.sms_service ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {c.sms_service ? "Yes" : "No"}
                  </span>
                </td>

                <td className="py-2 px-1 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${c.isLive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {c.isLive ? "Yes" : "No"}
                  </span>
                </td>


                <td className="py-2 px-1 text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${c.approval_system ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    {c.approval_system ? "Yes" : "No"}
                  </span>
                </td>


                <td className="py-2 px-1 text-center">
                  <span className={`px-2 py-1 text-xs rounded-full ${c.collection_app ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {c.collection_app ? "Active" : "Inactive"}
                  </span>
                </td>


                <td className="py-2 px-4 text-center">
                  <div className="flex justify-center items-center space-x-2">

                    <button onClick={() => handleViewClick(c)} className="p-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-800" title="View Details">
                      <Eye size={18} />
                    </button>

                    <button onClick={() => handleEditClick(c)} className="p-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800" title="Edit">
                      ✎
                    </button>

                    <button onClick={() => handleDelete(c.client_id)} className="p-1 rounded hover:bg-red-50 text-red-600 hover:text-red-800" title="Delete">
                      🗑
                    </button>

                    {/* Settings / Three-dot Button */}
                    {/* <button onClick={() => console.log("Settings clicked for client:", c.client_id)} className="p-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                      title="More Options"
                    >
                      ⋮
                    </button> */}

                    <button
                      onClick={() => setMenuClient(c)}
                      className="p-1 rounded hover:bg-gray-50 text-gray-600 hover:text-gray-800"
                      title="More Options"
                    >
                      ⋮
                    </button>


                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={9} className="py-4 text-center text-gray-500">No clients found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-xl relative">
            <button className="absolute top-3 right-3 text-gray-500 hover:text-gray-800" onClick={() => setModalOpen(false)}>✕</button>
            <div className="px-5 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">{selectedClient ? "Edit Client" : "Create New Client"}</h2>
              <p className="text-gray-500 mt-1 text-xs">Fill all required fields below</p>
            </div>
            <div className="px-5 py-3">
              <ClientForm
                client={selectedClient}
                databases={databases}
                onSubmit={handleUpdate}
                onCreate={handleCreate}
                onClose={() => setModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* View Client Modal */}
      {viewClient && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">

            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-800" onClick={() => setViewClient(null)}>
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-4">Client Details</h2>
            <div className="space-y-2 text-sm text-gray-700">
              {viewClient.logo && (
                <div className="flex items-center space-x-2">
                  {/\.(jpg|jpeg|png|gif|bmp)$/i.test(viewClient.logo) ? (
                    <img src={`http://localhost:5114/api/ClientDetail/image/${viewClient.client_id}/${viewClient.logo}`} alt={viewClient.client_name} className="w-16 h-16 object-cover rounded" />
                  ) : (
                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-xs">DOC</div>
                  )}
                  <span>{viewClient.logo}</span>
                </div>
              )}
              <div><strong>Name:</strong> {viewClient.client_name}</div>
              <div><strong>DB Name:</strong> {viewClient.db_name}</div>
              <div><strong>Owner:</strong> {viewClient.owner || "N/A"}</div>
              <div><strong>Address:</strong> {viewClient.address || "N/A"}</div>
              <div><strong>Primary Phone:</strong> {viewClient.primary_phone || "N/A"}</div>
              <div><strong>Secondary Phone:</strong> {viewClient.secondary_phone || "N/A"}</div>
              <div><strong>Primary Email:</strong> {viewClient.primary_email || "N/A"}</div>
              <div><strong>Secondary Email:</strong> {viewClient.secondary_email || "N/A"}</div>
              <div><strong>SMS Service:</strong> {viewClient.sms_service ? "Yes" : "No"}</div>
              <div><strong>Approval System:</strong> {viewClient.approval_system ? "Yes" : "No"}</div>
              <div><strong>Active:</strong> {viewClient.collection_app ? "Yes" : "No"}</div>
              <div><strong>isLive</strong> {viewClient.isLive ? "Yes" : "No"}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
