import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===== Backend Response Model ===== */
interface AppMenu {
  ID: number;
  MenuId: string;
  MenuName: string;
  NepaliName: string;
  MenuDescription: string;
  IsActive: boolean;
  MenuGroup: string;
  MenuGroupID: number;
  BackDateEntryAllowed: boolean;
}

/* ===== Component Props ===== */
interface PermissionTableModalProps {
  clientId: number;
  onClose: () => void;
}

const PermissionTableModal: React.FC<PermissionTableModalProps> = ({
  clientId,
  onClose,
}) => {
  const [menus, setMenus] = useState<AppMenu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  /* ===== Fetch Permissions ===== */
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await fetch(
          "http://localhost:5114/api/AppMenu/GetAll"
        );

        if (!res.ok) {
          throw new Error("Failed to fetch permissions");
        }

        const data: AppMenu[] = await res.json();
        setMenus(data);
      } catch (err: any) {
        console.error(err);
        setError("Unable to load permissions");
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  /* ===== Navigation ===== */
  const handleEdit = (menu: AppMenu) => {
    onClose();
    navigate(`/clients/${clientId}/permissions/${menu.MenuId}/edit`);
  };

  /* ===== UI ===== */
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[950px] max-h-[85vh] overflow-hidden rounded-lg shadow-lg flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-3 border-b">
          <h2 className="text-lg font-semibold">Manage Permissions</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-auto">
          {loading && (
            <p className="text-center text-gray-500 py-10">
              Loading permissions...
            </p>
          )}

          {error && (
            <p className="text-center text-red-600 py-10">
              {error}
            </p>
          )}

          {!loading && !error && (
            <table className="w-full border text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="border px-3 py-2 text-left">
                    Permission Name
                  </th>
                  <th className="border px-3 py-2 text-left">
                    Menu Group
                  </th>
                  <th className="border px-3 py-2 text-center">
                    Active
                  </th>
                  <th className="border px-3 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {menus.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="text-center py-6 text-gray-500"
                    >
                      No permissions found
                    </td>
                  </tr>
                )}

                {menus.map(menu => (
                  <tr
                    key={menu.ID}
                    className="hover:bg-gray-50"
                  >
                    <td className="border px-3 py-2">
                      {menu.MenuName}
                    </td>

                    <td className="border px-3 py-2">
                      {menu.MenuGroup}
                    </td>

                    <td className="border px-3 py-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          menu.IsActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {menu.IsActive ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="border px-3 py-2 text-center">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PermissionTableModal;
