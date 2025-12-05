import React, { useState } from "react";
import { logoService } from "../../services/LogoService/LogoService";

export default function LogoUpload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    try {
      const response = await logoService.upload(file);
      console.log("Uploaded:", response.data);
      alert("Logo uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={handleUpload}>
        Upload Logo
      </button>
    </div>
  );
}
