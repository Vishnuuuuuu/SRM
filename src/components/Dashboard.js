import { jsPDF } from 'jspdf'; // Import jsPDF library
import 'jspdf-autotable'; // Import the autoTable plugin
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Dashboard.css';


const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [fromPoints, setFromPoints] = useState([]);
  const [toPoints, setToPoints] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedFrom, setSelectedFrom] = useState('');
  const [selectedTo, setSelectedTo] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [vehicleData, setVehicleData] = useState(null);
  const [driverData, setDriverData] = useState(null);
  const [fromToData, setFromToData] = useState(null);
  const [vehicleError, setVehicleError] = useState('');
  const [driverError, setDriverError] = useState('');
  const [fromToError, setFromToError] = useState('');

  // Fetch vehicles, drivers, from points, and to points on component mount
  useEffect(() => {
    fetch('https://probable-aged-leather.glitch.me/get-vehicles')
      .then(response => response.json())
      .then(data => setVehicles(data))
      .catch(error => console.error('Error fetching vehicles:', error));

    fetch('https://probable-aged-leather.glitch.me/get-drivers')
      .then(response => response.json())
      .then(data => setDrivers(data))
      .catch(error => console.error('Error fetching drivers:', error));

    fetch('https://probable-aged-leather.glitch.me/get-from-points')
      .then(response => response.json())
      .then(data => setFromPoints(data))
      .catch(error => console.error('Error fetching from points:', error));

    fetch('https://probable-aged-leather.glitch.me/get-to-points')
      .then(response => response.json())
      .then(data => setToPoints(data))
      .catch(error => console.error('Error fetching to points:', error));
  }, []);

  // Handle fetching from-to data based on selected from, to, month, and vehicle/driver
  const fetchFromToData = async (month, year) => {
    if (!selectedFrom || !selectedTo) return;
    try {
      const response = await fetch(`https://probable-aged-leather.glitch.me/get-from-to-summary?from=${selectedFrom}&to=${selectedTo}&month=${month}&year=${year}`);
      if (response.status === 404) {
        setFromToError(`No data exists for ${selectedFrom} to ${selectedTo} in month ${month}, year ${year}.`);
        setFromToData(null);
      } else {
        const data = await response.json();
        setFromToData(data);
        setFromToError('');
      }
    } catch (error) {
      console.error('Error fetching from-to summary:', error);
    }
  };

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

    // Fetch From-To data
    if (selectedFrom && selectedTo) {
      fetchFromToData(month, year);
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
  doc.text(`Total Maintenance: ₹${totalMaintenance.toLocaleString('en-IN')}`, 10, 20);
  doc.text(`Total Diesel: ${totalDiesel} L`, 10, 30);

  // Table headers
  const headers = ["Date", "From", "To", "Driver", "Diesel (L)", "Maintenance (₹)"];
  const rows = vehicleData.trips.map((trip) => [
    trip.date,
    trip.from,
    trip.to,
    trip.driverName,
    trip.dieselAmount,
    trip.maintenanceAmount
  ]);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 40
  });

  doc.save(`${selectedVehicle}-summary.pdf`);
};

// Function to generate PDF for From-To summary
const downloadFromToSummary = () => {
  const doc = new jsPDF();
  doc.text(`From-To Summary for ${selectedFrom} to ${selectedTo}`, 10, 10);

  // Table headers
  const headers = ["Date", "Vehicle", "Driver"];
  const rows = fromToData.map((item) => [
    item.date,
    item.vehicleNumber,
    item.driverName
  ]);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 20
  });

  doc.save(`${selectedFrom}-${selectedTo}-summary.pdf`);
};

  // Function to generate PDF for driver summary
const downloadDriverSummary = () => {
  const doc = new jsPDF();
  doc.text(`Driver Summary for ${selectedDriver}`, 10, 10);
  doc.text(`Total Advance: ₹${totalDriverAdvance.toLocaleString('en-IN')}`, 10, 20);

  // Table headers
  const headers = [["Date", "Advance (₹)"]];
  const rows = driverData.advances.map((advance) => [
    advance.date,
    advance.advanceAmount.toLocaleString('en-IN'),
  ]);

  // Generate table
  doc.autoTable({
    head: headers,
    body: rows,
    startY: 30, // Start the table below the text
  });

  // Save the PDF
  doc.save(`${selectedDriver}-summary.pdf`);
};

  

  // Auto deselect driver and vehicle when selecting from and to
  const handleFromToSelection = (type, value) => {
    if (type === 'from') {
      setSelectedFrom(value);
      setSelectedVehicle('');
      setSelectedDriver('');
    } else if (type === 'to') {
      setSelectedTo(value);
      setSelectedVehicle('');
      setSelectedDriver('');
    }
  };

  // Auto deselect from and to when selecting vehicle or driver
  const handleVehicleDriverSelection = (type, value) => {
    if (type === 'vehicle') {
      setSelectedVehicle(value);
      setSelectedFrom('');
      setSelectedTo('');
    } else if (type === 'driver') {
      setSelectedDriver(value);
      setSelectedFrom('');
      setSelectedTo('');
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard Page</h1>

      {/* Vehicle Dropdown */}
      <label htmlFor="vehicle-dropdown">Select a Vehicle:</label>
      <select
        id="vehicle-dropdown"
        value={selectedVehicle}
        onChange={(e) => handleVehicleDriverSelection('vehicle', e.target.value)}
      >
        <option value="">-- Select a Vehicle --</option>
        {vehicles.map(vehicle => (
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
        onChange={(e) => handleVehicleDriverSelection('driver', e.target.value)}
      >
        <option value="">-- Select a Driver --</option>
        {drivers.map(driver => (
          <option key={driver._id} value={driver.driverName}>
            {driver.driverName}
          </option>
        ))}
      </select>

      {/* From Dropdown */}
      <label htmlFor="from-dropdown">Select a From Point:</label>
      <select
        id="from-dropdown"
        value={selectedFrom}
        onChange={(e) => handleFromToSelection('from', e.target.value)}
      >
        <option value="">-- Select a From Point --</option>
        {fromPoints.map((point) => (
          <option key={point._id} value={point.pointName}>{point.pointName}</option>
        ))}
      </select>

      {/* To Dropdown */}
      <label htmlFor="to-dropdown">Select a To Point:</label>
      <select
        id="to-dropdown"
        value={selectedTo}
        onChange={(e) => handleFromToSelection('to', e.target.value)}
      >
        <option value="">-- Select a To Point --</option>
        {toPoints.map((point) => (
          <option key={point._id} value={point.pointName}>{point.pointName}</option>
        ))}
      </select>

      {/* Calendar */}
      <label>Select a Month:</label>
      <Calendar onChange={handleDateChange} value={selectedDate} view="year" maxDetail="year" minDetail="year" />

      {/* Display From-To Data or Error Message */}
      {selectedFrom && selectedTo && (
        <div className="from-to-summary">
          <h2>From-To Summary for {selectedFrom} to {selectedTo}</h2>
          {fromToError ? (
            <p>{fromToError}</p>
          ) : (
            fromToData && (
              <>
                <h3>Trips</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Vehicle</th>
                      <th>Driver</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fromToData.map((item, index) => (
                      <tr key={index}>
                        <td>{item.date}</td>
                        <td>{item.vehicleNumber}</td>
                        <td>{item.driverName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Print button for from-to summary */}
                <button onClick={downloadFromToSummary}>Download From-To Summary</button>
              </>
            )
          )}
        </div>
      )}

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
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Driver</th>
                      <th>Diesel (L)</th>
                      <th>Maintenance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleData.trips.map((trip, index) => (
                      <tr key={index}>
                        <td>{trip.date}</td>
                        <td>{trip.from}</td>
                        <td>{trip.to}</td>
                        <td>{trip.driverName}</td>
                        <td>{trip.dieselAmount}</td>
                        <td>{trip.maintenanceAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

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
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Advance (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {driverData.advances.map((advance, index) => (
                      <tr key={index}>
                        <td>{advance.date}</td>
                        <td>{advance.advanceAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

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
