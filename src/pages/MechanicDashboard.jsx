import { useEffect, useState } from 'react';
import API from '../utils/api';
import socket from '../socket'; // ✅ Socket.IO

const statusFlow = {
  pending: ['accepted'],
  accepted: ['in-progress'],
  'in-progress': ['resolved'],
  resolved: [],
};

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-orange-100 text-orange-800',
  resolved: 'bg-green-100 text-green-800',
};

const MechanicDashboard = () => {
  const [requests, setRequests] = useState([]);

  // ✅ Fetch initial help requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await API.get('/help/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(res.data.requests);
      } catch (err) {
        console.error('Failed to fetch help requests:', err.response?.data || err.message);
      }
    };
    fetchRequests();
  }, []);

  // ✅ Listen for real-time new help requests
  useEffect(() => {
    socket.on('new-help-request', (newRequest) => {
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => console.warn("🔇 Audio play failed"));
  
      if (Notification.permission === 'granted') {
        new Notification('🚨 New Help Request', {
          body: `${newRequest.userId.name} needs help at ${newRequest.location}`,
          icon: '/alert-icon.png' // Optional: Add an icon in public folder
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('🚨 New Help Request', {
              body: `${newRequest.userId.name} needs help at ${newRequest.location}`,
              icon: '/alert-icon.png'
            });
          } else {
            alert('🚨 New help request received!');
          }
        });
      } else {
        alert('🚨 New help request received!');
      }
  
      setRequests((prev) => [newRequest, ...prev]);
    });
  
    return () => socket.off('new-help-request');
  }, []);
  
  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await API.patch(`/help/${id}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: newStatus } : req
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
      console.error('Error updating status:', err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Mechanic Dashboard</h2>

      {requests.length === 0 ? (
        <p>No help requests yet.</p>
      ) : (
        <ul className="space-y-4">
          {requests.map((req) => (
            <li key={req._id} className="border p-4 rounded bg-white shadow">
              <p>
                <strong>Status:</strong>{' '}
                <span className={`inline-block px-2 py-1 text-sm font-medium rounded ${statusColors[req.status]}`}>
                  {req.status}
                </span>
              </p>
              <p><strong>Urgency:</strong> {req.urgency}</p>
              <p><strong>Vehicle Type:</strong> {req.vehicleType}</p>
              <p><strong>Location:</strong> {req.location}</p>
              {req.userId && (
                <>
                  <p><strong>Requested By:</strong> {req.userId.name}</p>
                  <p><strong>Email:</strong> {req.userId.email}</p>
                  <p><strong>Phone:</strong> {req.userId.phone || 'N/A'}</p>
                </>
              )}

              {statusFlow[req.status].length > 0 && (
                <div className="mt-3">
                  <label className="mr-2 font-medium">Change Status:</label>
                  <select
                    value=""
                    onChange={(e) => handleStatusChange(req._id, e.target.value)}
                    className="border px-3 py-1 rounded text-sm bg-gray-50"
                  >
                    <option disabled value="">Select</option>
                    {statusFlow[req.status].map((next) => (
                      <option key={next} value={next}>
                        {next}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {req.status === 'resolved' && (
                <p className="mt-3 text-green-700 font-semibold">✅ Request Resolved</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MechanicDashboard;
