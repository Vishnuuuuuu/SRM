import React, { useEffect, useState } from 'react';
import './Daily.css';

const DailyUpdate = () => {
  const [vehicles, setVehicles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [fromPoints, setFromPoints] = useState([]); // New state for 'from' points
  const [toPoints, setToPoints] = useState([]); // New state for 'to' points

  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDriver, setSelectedDriver] = useState(''); 
  const [selectedFrom, setSelectedFrom] = useState(''); // New state for selected 'from' point
  const [selectedTo, setSelectedTo] = useState(''); // New state for selected 'to' point

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

  // Fetch vehicles, categories, drivers, from points, and to points
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

    fetch('https://probable-aged-leather.glitch.me/get-from-points')
      .then((response) => response.json())
      .then((data) => setFromPoints(data))
      .catch((error) => console.error('Error fetching from points:', error));

    fetch('https://probable-aged-leather.glitch.me/get-to-points')
      .then((response) => response.json())
      .then((data) => setToPoints(data))
      .catch((error) => console.error('Error fetching to points:', error));

    // Set current date when the component is mounted
    const today = new Date().toLocaleDateString();
    setCurrentDate(today);
  }, []);

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
    if (!selectedFrom) {
      alert('Please select a "From" point.');
      return;
    }
    if (!selectedTo) {
      alert('Please select a "To" point.');
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
  
    // Prepare vehicle summary data
    const vehicleSummaryData = {
      selectedVehicle,
      from: selectedFrom,
      to: selectedTo,
      dieselAmount: showDiesel ? dieselAmount : 0,
      maintenanceAmount: showMaintenance ? maintenanceAmount : 0,
      date: currentDate,
      driverName: selectedDriver,
    };
  
    const driverSummaryData = {
      selectedDriver,
      advanceAmount: showAdvance ? advanceAmount : 0,
      date: currentDate,
    };
  
    // Prepare From-to-summary data
    const fromToSummaryData = {
      selectedVehicle,
      selectedDriver,
      from: selectedFrom,
      to: selectedTo,
      date: currentDate,
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
  
      // Submit from-to-summary
      const fromToResponse = await fetch('https://probable-aged-leather.glitch.me/submit-from-to-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fromToSummaryData),
      });
      const fromToResult = await fromToResponse.json();
      console.log('From-to Summary:', fromToResult);
  
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

      {/* From Dropdown */}
      <label htmlFor="from-dropdown">Select a From Point:</label>
      <select id="from-dropdown" value={selectedFrom} onChange={(e) => setSelectedFrom(e.target.value)}>
        <option value="">-- Select a From Point --</option>
        {fromPoints.map((point) => (
          <option key={point._id} value={point.pointName}>{point.pointName}</option>
        ))}
      </select>

      {/* To Dropdown */}
      <label htmlFor="to-dropdown">Select a To Point:</label>
      <select id="to-dropdown" value={selectedTo} onChange={(e) => setSelectedTo(e.target.value)}>
        <option value="">-- Select a To Point --</option>
        {toPoints.map((point) => (
          <option key={point._id} value={point.pointName}>{point.pointName}</option>
        ))}
      </select>

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
