import React, { useEffect, useState } from "react";
import { Client, NewClient } from "../../types";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import clientService from "../../services/Client/clientService";

const ClientPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (data: NewClient & { logo?: File }) => {
    try {
      await clientService.create(data);
      fetchClients();
      setModalOpen(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to create client");
    }
  };

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

  const handleEditClick = (client: Client) => {
    setSelectedClient(client);
    setModalOpen(true);
  };

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Clients List Table</h1>
        <button
          onClick={() => { setSelectedClient(null); setModalOpen(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + New Client
        </button>
      </div>

      <ClientList clients={clients} onEdit={handleEditClick} onDelete={handleDelete} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-10 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">{selectedClient ? "Edit Client" : "Create New Client"}</h2>
            <ClientForm
              client={selectedClient}
              onSubmit={handleUpdate}
              onCreate={handleCreate}
              onClose={() => setModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPage;
