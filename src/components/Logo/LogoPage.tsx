import React, { useState } from "react";
import { logoService } from "../../services/LogoService/LogoService";

export default function LogoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);

    if (selected) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMessage("");
    try {
      const response = await logoService.upload(file);
      setMessage("Logo uploaded successfully!");
      console.log("Uploaded:", response.data);
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
      setMessage("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Logo Settings</h2>

      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition-colors">
        {preview ? (
          <img src={preview} alt="Logo Preview" className="h-32 mb-4 object-contain" />
        ) : (
          <p className="text-gray-400 mb-4">Drag & drop or select a logo</p>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="logo-upload"
        />
        <label
          htmlFor="logo-upload"
          className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors"
        >
          {file ? "Change File" : "Choose File"}
        </label>
      </div>

      {file && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className={`mt-6 w-full py-2 rounded-md text-white font-medium transition-colors ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Uploading..." : "Upload Logo"}
        </button>
      )}

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
