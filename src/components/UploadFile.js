import React, { useEffect, useState } from 'react';

const UploadFile = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [file, setFile] = useState(null);

  // Fetch the vehicle list on component mount
  useEffect(() => {
    fetch('https://probable-aged-leather.glitch.me/get-vehicles')
      .then(response => response.json())
      .then(data => setVehicles(data))
      .catch(error => console.error('Error fetching vehicles:', error));
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedVehicle || !file) {
      alert('Please select a vehicle and a file.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('vehicleNumber', selectedVehicle);
    formData.append('file', file);

    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/upload-file', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload File for Vehicle</h2>
      <form onSubmit={handleUpload}>
        <label htmlFor="vehicle-select">Select Vehicle:</label>
        <select
          id="vehicle-select"
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="">-- Select a Vehicle --</option>
          {vehicles.map(vehicle => (
            <option key={vehicle._id} value={vehicle.vehicleNumber}>
              {vehicle.vehicleNumber}
            </option>
          ))}
        </select>

        <label htmlFor="file-upload">Select File:</label>
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          accept=".jpg,.jpeg,.png,.pdf"
        />

        <button type="submit">Upload File</button>
      </form>
    </div>
  );
};

export default UploadFile;
