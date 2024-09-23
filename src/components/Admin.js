import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [newVehicle, setNewVehicle] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');

  // Fetch all vehicles for the dropdown
  const fetchVehicles = async () => {
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/get-vehicles');
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  // Fetch all drivers for the dropdown
  const fetchDrivers = async () => {
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/get-drivers');
      const data = await response.json();
      setDrivers(data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
  }, []);

  // Add Vehicle Handler
  const handleAddVehicle = async () => {
    if (!newVehicle) {
      alert('Please enter a vehicle number');
      return;
    }
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/add-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber: newVehicle })
      });
      const result = await response.json();
      alert(result.message);
      setNewVehicle(''); // Clear the input after adding
      fetchVehicles(); // Refresh the vehicle list
    } catch (error) {
      console.error('Error adding vehicle:', error);
      alert('Error adding vehicle');
    }
  };

  // Add Driver Handler
  const handleAddDriver = async () => {
    if (!newDriver) {
      alert('Please enter a driver name');
      return;
    }
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/add-driver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverName: newDriver })
      });
      const result = await response.json();
      alert(result.message);
      setNewDriver(''); // Clear the input after adding
      fetchDrivers(); // Refresh the driver list
    } catch (error) {
      console.error('Error adding driver:', error);
      alert('Error adding driver');
    }
  };

  // Delete Vehicle Handler with Confirmation
  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) {
      alert('Please select a vehicle to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete vehicle ${selectedVehicle}?`)) {
      try {
        const response = await fetch(`https://probable-aged-leather.glitch.me/delete-vehicle/${selectedVehicle}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        setSelectedVehicle(''); // Clear selection after deleting
        fetchVehicles(); // Refresh the vehicle list
      } catch (error) {
        console.error('Error deleting vehicle:', error);
        alert('Error deleting vehicle');
      }
    }
  };

  const handleDeleteDriver = async () => {
    if (!selectedDriver) {
      alert('Please select a driver to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete driver ${selectedDriver}?`)) {
      try {
        const response = await fetch(`https://probable-aged-leather.glitch.me/delete-driver/${selectedDriver}`, {
          method: 'DELETE',
        });
  
        // Check if the response is OK
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        alert(result.message);
        setSelectedDriver(''); // Clear selection after deleting
        fetchDrivers(); // Refresh the driver list
      } catch (error) {
        console.error('Error deleting driver:', error);
        alert('Error deleting driver');
      }
    }
 
  
  };

  return (
    <div>
      <h1>Admin Page</h1>

      {/* Add Vehicle */}
      <div>
        <h2>Add a Vehicle</h2>
        <input
          type="text"
          value={newVehicle}
          placeholder="Enter Vehicle Number"
          onChange={(e) => setNewVehicle(e.target.value)}
        />
        <button onClick={handleAddVehicle}>Add Vehicle</button>
      </div>

      {/* Add Driver */}
      <div>
        <h2>Add a Driver</h2>
        <input
          type="text"
          value={newDriver}
          placeholder="Enter Driver Name"
          onChange={(e) => setNewDriver(e.target.value)}
        />
        <button onClick={handleAddDriver}>Add Driver</button>
      </div>

      {/* Delete Vehicle */}
      <div>
        <h2>Delete a Vehicle</h2>
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
        >
          <option value="">-- Select a Vehicle --</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle._id} value={vehicle.vehicleNumber}>
              {vehicle.vehicleNumber}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteVehicle}>Delete Vehicle</button>
      </div>

      {/* Delete Driver */}
      <div>
        <h2>Delete a Driver</h2>
        <select
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          <option value="">-- Select a Driver --</option>
          {drivers.map((driver) => (
            <option key={driver._id} value={driver.driverName}>
              {driver.driverName}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteDriver}>Delete Driver</button>
      </div>
    </div>
  );
};

export default Admin;
