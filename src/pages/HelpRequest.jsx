import { useState } from 'react';
import API from '../utils/api';
import MapComponent from '../components/MapComponent'; // import the map

const HelpRequest = () => {
  const [form, setForm] = useState({
    vehicleType: '',
    description: '',
    urgency: 'Medium',
  });

  const [location, setLocation] = useState(null); // lat/lng from map

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location) {
      alert('📍 Please select your location on the map!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await API.post(
        '/help/request',
        {
          ...form,
          location: `${location.lat},${location.lng}`,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert('✅ Help request submitted!');
      setForm({ vehicleType: '', description: '', urgency: 'Medium' });
      setLocation(null);
    } catch (err) {
      console.error(err);
      alert('❌ Failed to send request.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-600">Request Help</h2>

        <input
          type="text"
          name="vehicleType"
          placeholder="Vehicle Type (e.g. Car, Bike)"
          value={form.vehicleType}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <textarea
          name="description"
          placeholder="Describe the issue"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />

        <select
          name="urgency"
          value={form.urgency}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div>
          <label className="block font-medium mb-1 text-gray-700">Select Your Location on Map:</label>
          <MapComponent onLocationSelect={setLocation} />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Submit Request
        </button>
      </form>
    </div>
  );
};

export default HelpRequest;
