import React, { useEffect, useState } from 'react';
import './Daily.css';

const DailyUpdate = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');  // New driver state
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Date state to display the current date
  const [currentDate, setCurrentDate] = useState('');

  // Driver's Advance State
  const [showAdvance, setShowAdvance] = useState(false);
  const [advanceAmount, setAdvanceAmount] = useState('');
  
  // Diesel State
  const [showDiesel, setShowDiesel] = useState(false);
  const [dieselAmount, setdieselAmount] = useState('');
  
  // Maintenance State
  const [showMaintenance, setShowMaintenance] = useState(false);
  const [maintenanceAmount, setMaintenanceAmount] = useState('');

  // Fetch vehicles, categories, and drivers
  useEffect(() => {
    fetch('https://probable-aged-leather.glitch.me/get-vehicles')
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error('Error fetching vehicles:', error));

    fetch('https://probable-aged-leather.glitch.me/get-categories')
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error('Error fetching categories:', error));

    fetch('https://probable-aged-leather.glitch.me/get-drivers')
      .then((response) => response.json())
      .then((data) => setDrivers(data))
      .catch((error) => console.error('Error fetching drivers:', error));

    // Set current date when the component is mounted
    const today = new Date().toLocaleDateString();
    setCurrentDate(today);
  }, []);

  // Submit logic with validation for mandatory fields
const handleSubmit = async () => {
  // Validation
  if (!selectedVehicle) {
    alert('Please select a vehicle.');
    return;
  }
  if (!selectedCategory) {
    alert('Please select a category.');
    return;
  }
  if (!selectedDriver) {
    alert('Please select a driver.');
    return;
  }
  if (!from) {
    alert('Please fill the "From" field.');
    return;
  }
  if (!to) {
    alert('Please fill the "To" field.');
    return;
  }
  if (showAdvance && !advanceAmount) {
    alert('Please fill the advance amount.');
    return;
  }
  if (showDiesel && !dieselAmount) {
    alert('Please fill the diesel amount.');
    return;
  }
  if (showMaintenance && !maintenanceAmount) {
    alert('Please fill the maintenance amount.');
    return;
  }

  // Format current date
  const currentDate = new Date().toLocaleDateString();

  // Prepare vehicle summary data, include driver's name
  const vehicleSummaryData = {
    selectedVehicle,
    from,
    to,
    dieselAmount: showDiesel ? dieselAmount : 0, // Storing diesel amount
    maintenanceAmount: showMaintenance ? maintenanceAmount : 0, // Storing maintenance amount
    date: currentDate,  // Add the current date to the form data
    driverName: selectedDriver,  // Include driver's name in the vehicle summary data
  };

  const driverSummaryData = {
    selectedDriver,
    advanceAmount: showAdvance ? advanceAmount : 0,  // Store 0 if no advance
    date: currentDate,  // Add the current date to the form data
  };

  try {
    // Submit vehicle summary
    const vehicleResponse = await fetch('https://probable-aged-leather.glitch.me/submit-vehicle-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleSummaryData),
    });
    const vehicleResult = await vehicleResponse.json();
    console.log('Vehicle Summary:', vehicleResult);

    // Submit driver summary
    const driverResponse = await fetch('https://probable-aged-leather.glitch.me/submit-driver-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(driverSummaryData),
    });
    const driverResult = await driverResponse.json();
    console.log('Driver Summary:', driverResult);

    alert('Data submitted successfully.');
  } catch (error) {
    console.error('Error submitting data:', error);
    alert('Error submitting data. Please try again.');
  }
};

  
  return (
    <div className="daily-update-container">
      <h1>
        Daily Update Page <span className="current-date">{currentDate}</span>
      </h1>
    
      {/* Vehicle Dropdown */}
      <label htmlFor="vehicle-dropdown">Select a Vehicle:</label>
      <select id="vehicle-dropdown" value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)}>
        <option value="">-- Select a Vehicle --</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle.vehicleNumber}>{vehicle.vehicleNumber}</option>
        ))}
      </select>

      {/* Category Dropdown */}
      <label htmlFor="category-dropdown">Select a Category:</label>
      <select id="category-dropdown" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
        <option value="">-- Select a Category --</option>
        {categories.map((category) => (
          <option key={category._id} value={category.categoryName}>{category.categoryName}</option>
        ))}
      </select>

      {/* Driver Dropdown */}
      <label htmlFor="driver-dropdown">Select a Driver:</label>
      <select id="driver-dropdown" value={selectedDriver} onChange={(e) => setSelectedDriver(e.target.value)}>
        <option value="">-- Select a Driver --</option>
        {drivers.map((driver) => (
          <option key={driver._id} value={driver.driverName}>{driver.driverName}</option>
        ))}
      </select>

      {/* From and To Text Boxes */}
      <label htmlFor="from">From:</label>
      <input type="text" id="from" value={from} onChange={(e) => setFrom(e.target.value)} />

      <label htmlFor="to">To:</label>
      <input type="text" id="to" value={to} onChange={(e) => setTo(e.target.value)} />

      {/* Driver's Advance Card */}
      <div>
        <label>Driver's Advance:</label>
        <input type="radio" name="advance" value="yes" onChange={() => setShowAdvance(true)} /> Yes
        <input type="radio" name="advance" value="no" onChange={() => setShowAdvance(false)} /> No
        {showAdvance && <input type="number" placeholder="Advance Amount (₹)" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />}
      </div>

      {/* Diesel Card */}
      <div>
        <label>Diesel:</label>
        <input type="radio" name="diesel" value="yes" onChange={() => setShowDiesel(true)} /> Yes
        <input type="radio" name="diesel" value="no" onChange={() => setShowDiesel(false)} /> No
        {showDiesel && <input type="number" placeholder="Diesel Liters (L)" value={dieselAmount} onChange={(e) => setdieselAmount(e.target.value)} />}
      </div>

      {/* Maintenance Card */}
      <div>
        <label>Maintenance:</label>
        <input type="radio" name="maintenance" value="yes" onChange={() => setShowMaintenance(true)} /> Yes
        <input type="radio" name="maintenance" value="no" onChange={() => setShowMaintenance(false)} /> No
        {showMaintenance && <input type="number" placeholder="Maintenance Amount (₹)" value={maintenanceAmount} onChange={(e) => setMaintenanceAmount(e.target.value)} />}
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default DailyUpdate;
