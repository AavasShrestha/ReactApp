// src/pages/Client/ClientList.tsx
import React from "react";
import { Client } from "../../types";
import { Pencil, Trash2 } from "lucide-react";

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: number) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete }) => (
  <div className="overflow-x-auto mt-6  maxw-full">
    <table className="min-w-full border border-gray-300 bg-white shadow-md rounded-lg  text-sm">
      <thead className="bg-gray-300 text-xs">
        <tr>
          {["S.N.", "Name", "DB", "Owner", "Address", "Phone", "Email", "sms_service","approval_system", "collection_app", "Status", "Actions"].map(h => (
            <th key={h} className="py-2 px-4 text-left text-sm font-semibold text-gray-700">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {clients.length ? clients.map((c, i) => (
          <tr key={c.client_id} className="border-t hover:bg-gray-50 transition">
            <td className="py-1 px-2">{i + 1}</td>
            <td className="py-1 px-2">{c.client_name}</td>
            <td className="py-1 px-2">{c.db_name}</td>
            <td className="py-1 px-2">{c.owner || "N/A"}</td>
            <td className="py-1 px-2">{c.address || "N/A"}</td>
            <td className="py-1 px-2">{c.primary_phone || "N/A"}</td>
            <td className="py-1 px-2">{c.primary_email || "N/A"}</td>
            <td className="py-1 px-2">{c.sms_service ? "true" : "false"}</td>
            <td className="py-1 px-2">{c.approval_system  ? "true" : "false"} </td>
            <td className="py-1 px-2">{c.collection_app  ? "true" : "false"}</td>
              <td className="py-2 px-1">
                <span className={`px-2 py-1 text-xs rounded-full ${c.collection_app ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {c.collection_app ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-2 px-4 text-center space-x-2">
                {/* <button onClick={() => onEdit(c)} className="text-blue-600 hover:text-blue-800 font-medium">Edit</button>
              <button onClick={() => onDelete(c.client_id)} className="text-red-600 hover:text-red-800 font-medium">Delete</button> */}

                <button
                  onClick={() => onEdit(c)}
                  className="p-1 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() => onDelete(c.client_id)}
                  className="p-1 rounded hover:bg-red-50 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>

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
);

export default ClientList;
