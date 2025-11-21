import React from "react";
import { Client } from "../../types";

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => (
  <div className="overflow-x-auto mt-6">
    <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg">
      <thead className="bg-gray-100">
        <tr>
          {["S.N.", "Client Name", "DB Name", "Address", "Primary Phone", "Secondary Phone", "Primary Email", "Secondary Email", "Status", "Actions"]
            .map((h) => <th key={h} className="py-2 px-4 text-left text-sm font-semibold text-gray-700">{h}</th>)}
        </tr>
      </thead>
      <tbody>
        {clients.length > 0 ? clients.map((c, index) => (
          <tr key={c.client_id} className="border-t hover:bg-gray-50 transition">
            <td className="py-2 px-4">{index + 1}</td>
            <td className="py-2 px-4">{c.client_name}</td>
            <td className="py-2 px-4">{c.db_name}</td>
            <td className="py-2 px-4">{c.address || "N/A"}</td>
            <td className="py-2 px-4">{c.primary_phone || "N/A"}</td>
            <td className="py-2 px-4">{c.secondary_phone || "N/A"}</td>
            <td className="py-2 px-4">{c.primary_email || "N/A"}</td>
            <td className="py-2 px-4">{c.secondary_email || "N/A"}</td>
            <td className="py-2 px-4">
              <span className={`px-3 py-1 text-xs rounded-full ${c.collection_app ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {c.collection_app ? "Active" : "Inactive"}
              </span>
            </td>
            <td className="py-2 px-4 text-center space-x-3">
              <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              <button onClick={() => onDelete(c.client_id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button>
            </td>
          </tr>
        )) : (
          <tr>
            <td colSpan={9} className="py-4 text-center text-gray-500">
              No clients found.
            </td>

          </tr>
        )}
      </tbody>
    </table>
  </div>
);

export default ClientList;
