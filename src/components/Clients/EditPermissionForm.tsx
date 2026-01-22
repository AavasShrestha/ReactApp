// Needs correction and swagger link.

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Define the shape of the permission form state
interface PermissionForm {
  menuId: string;
  permissionName: string;
  menuGroup: string;
  isActive: boolean;
  canAdd: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
}

const EditPermissionForm = () => {
  // const { id } = useParams();    // client id (if you came from client page)
  const { id, permissionId } = useParams();


  const [form, setForm] = useState<PermissionForm>({
    menuId: "",
    permissionName: "",
    menuGroup: "",
    isActive: true,
    canAdd: false,
    canEdit: false,
    canDelete: false,
    canView: false,
  });

  useEffect(() => {
    if (!id || !permissionId) return;

    // fetch permission detail
    console.log("Fetching permission", permissionId, "for client", id);

    // Example:
    // const data = await permissionService.getById(id, permissionId);
    // setForm(data);
  }, [id, permissionId]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const input = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: input.checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Saving Permission For Client:", id);
      console.log("Payload:", form);

      // TODO: Replace this with your backend API call
      // await permissionService.savePermission(id, form);

      alert("Permission saved successfully");
    } catch (err) {
      alert("Failed to save permission");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Back Navigation */}
      <button
        onClick={() => window.history.back()}
        className="text-sm text-blue-600 hover:underline mb-3"
      >
        ← Back to Permissions
      </button>
      <h1 className="text-2xl font-semibold mb-2">Edit Permission</h1>
      <p className="text-gray-500 mb-6">
        Client ID: <span className="font-semibold">{id}</span>
      </p>

      <div className="space-y-4 border p-5 rounded-lg shadow-sm bg-white">

        {/* Menu ID */}
        <div>
          <label className="block font-medium">Menu ID</label>
          <input
            type="text"
            name="menuId"
            value={form.menuId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Enter Menu ID"
          />
        </div>

        {/* Permission Name */}
        <div>
          <label className="block font-medium">Permission Name</label>
          <input
            type="text"
            name="permissionName"
            value={form.permissionName}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
            placeholder="Enter Permission Name"
          />
        </div>

        {/* Menu Group */}
        <div>
          <label className="block font-medium">Menu Group</label>
          <select
            name="menuGroup"
            value={form.menuGroup}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded mt-1"
          >
            <option value="">-- Select Menu Group --</option>
            <option value="Admin">Admin</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
            <option value="HR">HR</option>
          </select>
        </div>

        {/* Is Active Toggle */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <label className="font-medium">Is Active</label>
        </div>

        {/* Lower Level Permissions */}
        <div>
          <h3 className="font-semibold mb-2">Page Level Permissions</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="canAdd"
                checked={form.canAdd}
                onChange={handleChange}
              />
              Add
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="canEdit"
                checked={form.canEdit}
                onChange={handleChange}
              />
              Edit
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="canDelete"
                checked={form.canDelete}
                onChange={handleChange}
              />
              Delete
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="canView"
                checked={form.canView}
                onChange={handleChange}
              />
              View
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditPermissionForm;
