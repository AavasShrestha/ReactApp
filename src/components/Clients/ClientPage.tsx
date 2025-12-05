import React, { useEffect, useState } from "react";
import { Client, NewClient } from "../../types";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import clientService from "../../services/Client/clientService";

const ClientPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const handleCreate = async (data: NewClient) => {
    try {
      await clientService.create(data);
      await fetchClients();
      setIsCreateOpen(false);
    } catch (err) {
      console.error("Create error:", err);
    }
  };

  const handleUpdate = async (id: number, data: NewClient) => {
    try {
      await clientService.update(id, data);
      await fetchClients();
      setIsEditOpen(false);
      setSelectedClient(null);
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update client.");
    }
  };

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setIsEditOpen(true);
  };

  const handleDelete = async (id: number) => {
    const client = clients.find(c => c.client_id === id);
    if (!client) return;

    // Block deletion if client is active
    if (client.collection_app === true) {
      alert("This client is active. Please mark it as inactive before deleting.");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this inactive client?")) return;

    try {
      await clientService.delete(id);
      await fetchClients();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clients List Table</h1>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Client
        </button>
      </div>

      <ClientList clients={clients} onEdit={handleEditClick} onDelete={handleDelete} />

      {/* Create Client Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setIsCreateOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Create New Client</h2>
            <ClientForm client={null} onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} onSubmit={() => { }} />
          </div>
        </div>
      )}

      {/* Edit Client Drawer */}
      {isEditOpen && selectedClient && (
        <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-lg p-6 z-50 overflow-y-auto">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={() => setIsEditOpen(false)}
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold mb-4">Edit Client</h2>
          <ClientForm client={selectedClient} onClose={() => setIsEditOpen(false)} onCreate={() => { }} onSubmit={handleUpdate} />
        </div>
      )}
    </div>
  );
};

export default ClientPage;
