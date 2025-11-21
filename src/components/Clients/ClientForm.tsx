import React, { useEffect, useState } from "react";
import { Client, NewClient } from "../../types";

interface ClientFormProps {
  client?: Client | null;
  onSubmit: (id: number, data: NewClient) => void;
  onCreate: (data: NewClient) => void;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, onSubmit, onCreate, onClose }) => {
  const [formData, setFormData] = useState<NewClient>({
    client_name: "",
    db_name: "",
    address: "",
    primary_phone: "",
    secondary_phone: "",
    primary_email: "",
    secondary_email: "",
    owner: "",
    sms_service: false,
    approval_system: false,
    collection_app: false,
  });

  useEffect(() => {
    if (client) {
      const { client_id, created_by, modified_by, created_date, modified_date, logo, ...rest } = client;
      setFormData(rest);
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    client ? onSubmit(client.client_id, formData) : onCreate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
      {[
        { label: "Client Name", name: "client_name" },
        { label: "DB Name", name: "db_name" },
        { label: "Address", name: "address" },
        { label: "Primary Phone", name: "primary_phone" },
        { label: "Secondary Phone", name: "secondary_phone" },
        { label: "Primary Email", name: "primary_email" },
        { label: "Secondary Email", name: "secondary_email" },
      ].map(f => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          <input type="text" name={f.name} value={formData[f.name as keyof NewClient] || ""} onChange={handleChange} className="w-full border rounded px-3 py-2"/>
        </div>
      ))}

      <div className="flex items-center space-x-2">
        <input type="checkbox" name="collection_app" checked={formData.collection_app} onChange={handleChange} />
        <label className="text-sm font-medium text-gray-700">Active</label>
      </div>

      <div className="col-span-2 flex justify-end space-x-3 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">{client ? "Update" : "Create"}</button>
      </div>
    </form>
  );
};

export default ClientForm;
