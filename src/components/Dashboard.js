import { jsPDF } from 'jspdf'; // Import jsPDF library
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [vehicleData, setVehicleData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [vehicleError, setVehicleError] = useState('');
  const [driverError, setDriverError] = useState('');

  // Fetch vehicles and drivers on component mount
  useEffect(() => {
    fetch('https://probable-aged-leather.glitch.me/get-vehicles')
      .then((response) => response.json())
      .then((data) => setVehicles(data))
      .catch((error) => console.error('Error fetching vehicles:', error));

    fetch('https://probable-aged-leather.glitch.me/get-drivers')
      .then((response) => response.json())
      .then((data) => setDrivers(data))
      .catch((error) => console.error('Error fetching drivers:', error));
  }, []);

  // Fetch vehicle data based on selected month and vehicle
  const fetchVehicleData = async (month, year) => {
    if (!selectedVehicle) return;
    try {
      const response = await fetch(`https://probable-aged-leather.glitch.me/get-vehicle-summary?vehicle=${selectedVehicle}&month=${month}&year=${year}`);
      if (response.status === 404) {
        setVehicleError(`No data exists for vehicle ${selectedVehicle} in month ${month}, year ${year}.`);
        setVehicleData(null);
      } else {
        const data = await response.json();
        setVehicleData(data);
        setVehicleError(''); // Clear the error message if data is found
      }
    } catch (error) {
      console.error('Error fetching vehicle summary:', error);
    }
  };

  // Fetch driver data based on selected month and driver
  const fetchDriverData = async (month, year) => {
    if (!selectedDriver) return;
    try {
      const response = await fetch(`https://probable-aged-leather.glitch.me/get-driver-summary?driver=${selectedDriver}&month=${month}&year=${year}`);
      if (response.status === 404) {
        setDriverError(`No data exists for driver ${selectedDriver} in month ${month}, year ${year}.`);
        setDriverData(null);
      } else {
        const data = await response.json();
        setDriverData(data);
        setDriverError(''); // Clear the error message if data is found
      }
    } catch (error) {
      console.error('Error fetching driver summary:', error);
    }
  };

  // Handle calendar date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    const month = date.getMonth() + 1; // Month is zero-based
    const year = date.getFullYear();

    // Fetch data based on selected dropdown and date
    if (selectedVehicle) {
      fetchVehicleData(month, year);
    } else if (selectedDriver) {
      fetchDriverData(month, year);
    }
  };

  // Calculate the total maintenance and diesel amount for the vehicle
  const calculateVehicleSums = () => {
    if (!vehicleData || !vehicleData.trips) return { totalMaintenance: 0, totalDiesel: 0 };

    const totalMaintenance = vehicleData.trips.reduce((acc, trip) => acc + trip.maintenanceAmount, 0);
    const totalDiesel = vehicleData.trips.reduce((acc, trip) => acc + parseFloat(trip.dieselAmount || 0), 0);

    return { totalMaintenance, totalDiesel };
  };

  const calculateDriverAdvance = () => {
    if (!driverData || !driverData.advances) return 0;
  
    return driverData.advances.reduce((acc, advance) => acc + Number(advance.advanceAmount || 0), 0);
  };
  

  const { totalMaintenance, totalDiesel } = calculateVehicleSums();
  const totalDriverAdvance = calculateDriverAdvance();

  // Function to generate PDF for vehicle summary
  const downloadVehicleSummary = () => {
    const doc = new jsPDF();
    doc.text(`Vehicle Summary for ${selectedVehicle}`, 10, 10);
    doc.text(`Total Maintenance: ₹${totalMaintenance}`, 10, 20);
    doc.text(`Total Diesel: ${totalDiesel} L`, 10, 30);

    vehicleData.trips.forEach((trip, index) => {
      doc.text(
        `${trip.date}: From ${trip.from} to ${trip.to}, Driver: ${trip.driverName}, Diesel: ${trip.dieselAmount}L, Maintenance: ₹${trip.maintenanceAmount}`,
        10,
        40 + index * 10
      );
    });

    doc.save(`${selectedVehicle}.pdf`);
  };

  // Function to generate PDF for driver summary
  const downloadDriverSummary = () => {
    const doc = new jsPDF();
    doc.text(`Driver Summary for ${selectedDriver}`, 10, 10);
    doc.text(`Total Advance: ₹${totalDriverAdvance}`, 10, 20);

    driverData.advances.forEach((advance, index) => {
      doc.text(`${advance.date}: Advance Amount: ₹${advance.advanceAmount}`, 10, 30 + index * 10);
    });

    doc.save(`${selectedDriver}.pdf`);
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Page</h1>

      {/* Vehicle Dropdown */}
      <label htmlFor="vehicle-dropdown">Select a Vehicle:</label>
      <select
        id="vehicle-dropdown"
        value={selectedVehicle}
        onChange={(e) => {
          setSelectedVehicle(e.target.value);
          setSelectedDriver(''); // Clear driver selection if a vehicle is selected
        }}
      >
        <option value="">-- Select a Vehicle --</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle._id} value={vehicle.vehicleNumber}>
            {vehicle.vehicleNumber}
          </option>
        ))}
      </select>

      {/* Driver Dropdown */}
      <label htmlFor="driver-dropdown">Select a Driver:</label>
      <select
        id="driver-dropdown"
        value={selectedDriver}
        onChange={(e) => {
          setSelectedDriver(e.target.value);
          setSelectedVehicle(''); // Clear vehicle selection if a driver is selected
        }}
      >
        <option value="">-- Select a Driver --</option>
        {drivers.map((driver) => (
          <option key={driver._id} value={driver.driverName}>
            {driver.driverName}
          </option>
        ))}
      </select>

      {/* Calendar */}
      <label>Select a Month:</label>
      <Calendar onChange={handleDateChange} value={selectedDate} view="year" maxDetail="year" minDetail="year" />

      {/* Display Vehicle Data or Error Message */}
      {selectedVehicle && (
        <div className="vehicle-summary">
          <h2>Vehicle Summary for {selectedVehicle}</h2>
          {vehicleError ? (
            <p>{vehicleError}</p>
          ) : (
            vehicleData && (
              <>
                <p>Total Maintenance: ₹{totalMaintenance.toLocaleString('en-IN')}</p>
                <p>Total Diesel: {totalDiesel.toLocaleString('en-IN')} L</p>
                <p>Total Advance: ₹ {totalDriverAdvance.toLocaleString('en-IN')}</p>

                {/* List of trips */}
                <h3>Trips</h3>
                <ul>
                  {vehicleData.trips.map((trip, index) => (
                    <li key={index}>
                      {trip.date}: From {trip.from} to {trip.to}, Driver: {trip.driverName}, Diesel: {trip.dieselAmount}L, Maintenance: ₹{trip.maintenanceAmount}
                    </li>
                  ))}
                </ul>

                {/* Print button for vehicle summary */}
                <button onClick={downloadVehicleSummary}>Download Vehicle Summary</button>
              </>
            )
          )}
        </div>
      )}

      {/* Display Driver Data or Error Message */}
      {selectedDriver && (
        <div className="driver-summary">
          <h2>Driver Summary for {selectedDriver}</h2>
          {driverError ? (
            <p>{driverError}</p>
          ) : (
            driverData && (
              <>
                <p>Total Advance: ₹{totalDriverAdvance.toLocaleString('en-IN')}</p>

                {/* List of advances */}
                <ul>
                  {driverData.advances.map((advance, index) => (
                    <li key={index}>
                      {advance.date}: Advance Amount: ₹{advance.advanceAmount}
                    </li>
                  ))}
                </ul>

                {/* Print button for driver summary */}
                <button onClick={downloadDriverSummary}>Download Driver Summary</button>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
