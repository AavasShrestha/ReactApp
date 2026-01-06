import React, { useEffect, useState } from "react";
import { Client, NewClient } from "../../types";

const BASE_URL = "http://localhost:5114"; // Backend URL

interface ClientFormProps {
  client?: Client | null;
  // databases?: { Id: number; Db_name: string }[];
  databases?: string[];

  onSubmit: (id: number, data: NewClient & { logo?: File }) => void;
  onCreate: (data: NewClient & { logo?: File }) => void;
  onClose: () => void;
}

const ClientForm: React.FC<ClientFormProps> = ({ client, databases, onSubmit, onCreate, onClose }) => {
  const [formData, setFormData] = useState<NewClient & { logo?: File }>({
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
    isLive: false,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (client) {
      const { client_id, created_by, modified_by, created_date, modified_date, logo, ...rest } = client;
      setFormData({ ...rest });
      if (logo) setPreviewUrl(`${BASE_URL}/api/ClientDetail/image/${client.client_id}/${logo}`);
    } else {
      setFormData({
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
        isLive: false,
      });
      setPreviewUrl(null);
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked, files } = e.target as HTMLInputElement;
    if (type === "checkbox") setFormData({ ...formData, [name]: checked });
    else if (type === "file") {
      const file = files?.[0];
      setFormData({ ...formData, logo: file });
      if (file) setPreviewUrl(URL.createObjectURL(file));
    } else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    client ? onSubmit(client.client_id, formData) : onCreate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 bg-white p-4 rounded shadow">
      {[{ label: "Client Name", name: "client_name" },
      { label: "Owner", name: "owner" },
      { label: "Address", name: "address" },
      { label: "Primary Phone", name: "primary_phone" },
      { label: "Secondary Phone", name: "secondary_phone" },
      { label: "Primary Email", name: "primary_email" },
      { label: "Secondary Email", name: "secondary_email" },
      ].map(f => (
        <div key={f.name}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
          <input
            type="text"
            name={f.name}
            value={formData[f.name as keyof NewClient] || ""}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      ))}

      {/* DB Name Dropdown
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">DB Name</label>
        <select
          name="db_name"
          value={formData.db_name}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select Database</option>
          {databases?.map((db) => (
            <option key={db.Id} value={db.Db_name}>
              {db.Db_name}
            </option>
          ))}
        </select>
      </div> */}
      
      {/* DB Name Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">DB Name</label>
  <select
    name="db_name"
    value={formData.db_name}
    onChange={handleChange}
    className="w-full border rounded px-3 py-2"
  >
    <option value="">Select Database</option>
    {databases.map((dbName) => (
      <option key={dbName} value={dbName}>
        {dbName}
      </option>
    ))}
  </select>
</div>



      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
        <input type="file" accept="image/*" onChange={handleChange} />
        {previewUrl && (
          <div className="mt-2 flex items-center space-x-2">
            {formData.logo && formData.logo.type.startsWith("image/") || /\.(jpg|jpeg|png|gif|bmp)$/i.test(previewUrl) ? (
              <img src={previewUrl} alt="Preview" className="w-16 h-16 object-cover rounded" />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-600 rounded text-xs">
                DOC
              </div>
            )}
            <div className="text-xs text-gray-600">
              <div>{formData.logo?.name || previewUrl.split("/").pop()}</div>
              <div>{formData.logo?.type?.startsWith("image/") ? "Photo" : "Document"}</div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 col-span-2">
        <input type="checkbox" name="sms_service" checked={formData.sms_service} onChange={handleChange} />
        <label className="text-sm font-medium text-gray-700">SMS Service</label>
      </div>

      <div className="flex items-center space-x-2 col-span-2">
        <input type="checkbox" name="approval_system" checked={formData.approval_system} onChange={handleChange} />
        <label className="text-sm font-medium text-gray-700">Approval System</label>
      </div>

      <div className="flex items-center space-x-2 col-span-2">
        <input type="checkbox" name="collection_app" checked={formData.collection_app} onChange={handleChange} />
        <label className="text-sm font-medium text-gray-700">Active</label>
      </div>

      <div className="flex items-center space-x-2 col-span-2">
        <input type="checkbox" name="isLive" checked={formData.isLive} onChange={handleChange} />
        <label className="text-sm font-medium text-gray-700"> isLive </label>
      </div>

      <div className="col-span-2 flex justify-end space-x-3 mt-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          {client ? "Update Client" : "Create Client"}
        </button>
      </div>
    </form>
  );
};

export default ClientForm;
