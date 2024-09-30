import React, { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import './ViewFiles.css';

const ViewFiles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [files, setFiles] = useState([]);

  // Fetch the vehicle list on component mount
  useEffect(() => {
    fetch('https://probable-aged-leather.glitch.me/get-vehicles')
      .then(response => response.json())
      .then(data => setVehicles(data))
      .catch(error => console.error('Error fetching vehicles:', error));
  }, []);

  const handleVehicleSelect = async (e) => {
    const vehicleNumber = e.target.value;
    setSelectedVehicle(vehicleNumber);

    if (vehicleNumber) {
      try {
        const response = await fetch(`https://probable-aged-leather.glitch.me/get-vehicle-files?vehicleNumber=${vehicleNumber}`);
        if (!response.ok) {
          throw new Error('Error fetching files');
        }
        const data = await response.json();
        setFiles(data);
      } catch (error) {
        console.error('Error fetching files:', error);
        setFiles([]);
      }
    } else {
      setFiles([]);
    }
  };

  return (
    <div className="view-files-container">
      <h2>View Files for Vehicle</h2>
      <label htmlFor="vehicle-select">Select Vehicle:</label>
      <select
        id="vehicle-select"
        value={selectedVehicle}
        onChange={handleVehicleSelect}
      >
        <option value="">-- Select a Vehicle --</option>
        {vehicles.map(vehicle => (
          <option key={vehicle._id} value={vehicle.vehicleNumber}>
            {vehicle.vehicleNumber}
          </option>
        ))}
      </select>

      {files.length > 0 ? (
        <div className="file-grid">
          {files.map((file, index) => (
            <div key={index} className="file-tile">
              {/* Link to view the file */}
              <a
                href={`https://probable-aged-leather.glitch.me${file.filePath}`} // Full URL for viewing the file
                target="_blank"
                rel="noopener noreferrer"
                className="file-preview-link"
              >
                <div className="file-tile-content">
                  <p className="file-name">{file.fileName}</p>
                </div>
              </a>
              {/* Download link */}
              <a
                href={`https://probable-aged-leather.glitch.me${file.filePath}`} // Full URL for downloading the file
                download
                className="download-link"
                title="Download File"
              >
                <FiDownload size={24} />
              </a>
            </div>
          ))}
        </div>
      ) : selectedVehicle ? (
        <p>No files found for this vehicle.</p>
      ) : null}
    </div>
  );
};

export default ViewFiles;
