import React, { useEffect, useState } from 'react';

const Admin = () => {
  const [newVehicle, setNewVehicle] = useState('');
  const [newDriver, setNewDriver] = useState('');
  const [newFromPoint, setNewFromPoint] = useState('');
  const [newToPoint, setNewToPoint] = useState('');
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [fromPoints, setFromPoints] = useState([]);
  const [toPoints, setToPoints] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedFromPoint, setSelectedFromPoint] = useState('');
  const [selectedToPoint, setSelectedToPoint] = useState('');

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

  // Fetch all from points
  const fetchFromPoints = async () => {
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/get-from-points');
      const data = await response.json();
      setFromPoints(data);
    } catch (error) {
      console.error('Error fetching from points:', error);
    }
  };

  // Fetch all to points
  const fetchToPoints = async () => {
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/get-to-points');
      const data = await response.json();
      setToPoints(data);
    } catch (error) {
      console.error('Error fetching to points:', error);
    }
  };

  useEffect(() => {
    fetchVehicles();
    fetchDrivers();
    fetchFromPoints();
    fetchToPoints();
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

  // Add From Point Handler
  const handleAddFromPoint = async () => {
    if (!newFromPoint) {
      alert('Please enter a From Point');
      return;
    }
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/add-from-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointName: newFromPoint })
      });
      const result = await response.json();
      alert(result.message);
      setNewFromPoint(''); // Clear input after adding
      fetchFromPoints(); // Refresh the from points list
    } catch (error) {
      console.error('Error adding from point:', error);
      alert('Error adding from point');
    }
  };

  // Add To Point Handler
  const handleAddToPoint = async () => {
    if (!newToPoint) {
      alert('Please enter a To Point');
      return;
    }
    try {
      const response = await fetch('https://probable-aged-leather.glitch.me/add-to-point', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pointName: newToPoint })
      });
      const result = await response.json();
      alert(result.message);
      setNewToPoint(''); // Clear input after adding
      fetchToPoints(); // Refresh the to points list
    } catch (error) {
      console.error('Error adding to point:', error);
      alert('Error adding to point');
    }
  };

  // Delete Vehicle Handler
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

  // Delete Driver Handler
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

  // Delete From Point Handler
  const handleDeleteFromPoint = async () => {
    if (!selectedFromPoint) {
      alert('Please select a From Point to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete from point ${selectedFromPoint}?`)) {
      try {
        const response = await fetch(`https://probable-aged-leather.glitch.me/delete-from-point/${selectedFromPoint}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        setSelectedFromPoint(''); // Clear selection after deleting
        fetchFromPoints(); // Refresh the from points list
      } catch (error) {
        console.error('Error deleting from point:', error);
        alert('Error deleting from point');
      }
    }
  };

  // Delete To Point Handler
  const handleDeleteToPoint = async () => {
    if (!selectedToPoint) {
      alert('Please select a To Point to delete');
      return;
    }
    if (window.confirm(`Are you sure you want to delete to point ${selectedToPoint}?`)) {
      try {
        const response = await fetch(`https://probable-aged-leather.glitch.me/delete-to-point/${selectedToPoint}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        alert(result.message);
        setSelectedToPoint(''); // Clear selection after deleting
        fetchToPoints(); // Refresh the to points list
      } catch (error) {
        console.error('Error deleting to point:', error);
        alert('Error deleting to point');
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

      {/* Add From Point */}
      <div>
        <h2>Add a From Point</h2>
        <input
          type="text"
          value={newFromPoint}
          placeholder="Enter From Point"
          onChange={(e) => setNewFromPoint(e.target.value)}
        />
        <button onClick={handleAddFromPoint}>Add From Point</button>
      </div>

      {/* Add To Point */}
      <div>
        <h2>Add a To Point</h2>
        <input
          type="text"
          value={newToPoint}
          placeholder="Enter To Point"
          onChange={(e) => setNewToPoint(e.target.value)}
        />
        <button onClick={handleAddToPoint}>Add To Point</button>
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

      {/* Delete From Point */}
      <div>
        <h2>Delete a From Point</h2>
        <select
          value={selectedFromPoint}
          onChange={(e) => setSelectedFromPoint(e.target.value)}
        >
          <option value="">-- Select a From Point --</option>
          {fromPoints.map((point) => (
            <option key={point._id} value={point.pointName}>
              {point.pointName}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteFromPoint}>Delete From Point</button>
      </div>

      {/* Delete To Point */}
      <div>
        <h2>Delete a To Point</h2>
        <select
          value={selectedToPoint}
          onChange={(e) => setSelectedToPoint(e.target.value)}
        >
          <option value="">-- Select a To Point --</option>
          {toPoints.map((point) => (
            <option key={point._id} value={point.pointName}>
              {point.pointName}
            </option>
          ))}
        </select>
        <button onClick={handleDeleteToPoint}>Delete To Point</button>
      </div>
    </div>
  );
};

export default Admin;
