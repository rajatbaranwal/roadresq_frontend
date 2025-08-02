import { useEffect, useState } from 'react';

const dummyMechanics = [
  {
    id: 1,
    name: "Ravi Mech Works",
    serviceType: "Bike, Car",
    rating: 4.5,
    distance: "2.1 km",
  },
  {
    id: 2,
    name: "Highway Auto Fix",
    serviceType: "Car",
    rating: 4.2,
    distance: "3.4 km",
  },
  {
    id: 3,
    name: "24x7 Tow Service",
    serviceType: "Truck, Car",
    rating: 4.7,
    distance: "5.0 km",
  },
];

const MechanicList = () => {
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    // Later: Fetch mechanics from backend using user location
    setMechanics(dummyMechanics);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 text-center">
        Nearby Mechanics
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mechanics.map((mech) => (
          <div key={mech.id} className="bg-white shadow p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800">{mech.name}</h2>
            <p className="text-gray-600">Services: {mech.serviceType}</p>
            <p className="text-gray-600">Distance: {mech.distance}</p>
            <p className="text-yellow-500">Rating: ⭐ {mech.rating}</p>
            <button
              className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              onClick={() => alert(`Request sent to ${mech.name}`)}
            >
              Request Help
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MechanicList;
