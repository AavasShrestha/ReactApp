// src/pages/Client/ClientPage.tsx
import React, { useEffect, useState } from "react";
import { Client, NewClient } from "../../types";
import ClientList from "./ClientList";
import ClientForm from "./ClientForm";
import clientService from "../../services/Client/clientService";

const ClientPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (err) {
      console.error("❌ Failed to fetch clients:", err);
    }
  };

  const handleCreate = async (data: NewClient) => {
    try {
      await clientService.create(data);
      await fetchClients();
      setIsFormVisible(false);
    } catch (err) {
      console.error("❌ Failed to create client:", err);
    }
  };

 const handleUpdate = async (id: number, data: NewClient) => {
  try {
    await clientService.update(id, data); // backend API call
    await fetchClients();                 // refresh table
    setIsFormVisible(false);              // close form
    setSelectedClient(null);              // clear selection
  } catch (err) {
    console.error("Update error:", err);
    alert("Failed to update client.");
  }
};
  const handleEdit = (client: Client) => {
    setSelectedClient(client);   // load existing client data in form
    setIsFormVisible(true);      // open the form for editing
  };

  
const handleDelete = async (id: number) => {
  if (!window.confirm("Are you sure? This cannot be undone.")) return;

  try {
    await clientService.delete(id); // backend delete
    await fetchClients();           // refresh table
  } catch (err) {
    console.error("Delete error:", err);
    alert("Failed to delete client.");
  }
};

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Client Management</h1>
        <button
          onClick={() => {
            setSelectedClient(null);
            setIsFormVisible(!isFormVisible);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {isFormVisible ? "Close Form" : "+ New Client"}
        </button>
      </div>

      {isFormVisible && (
        <div className="mb-8 border p-4 rounded-lg shadow-md bg-gray-50">
          <ClientForm
            client={selectedClient}
            onClose={() => setIsFormVisible(false)}
            onSubmit={handleUpdate}
            onCreate={handleCreate}
          />
        </div>
      )}

      <ClientList
        clients={clients}
        onEdit={(client) => {
          setSelectedClient(client);
          setIsFormVisible(true);
        }}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ClientPage;
