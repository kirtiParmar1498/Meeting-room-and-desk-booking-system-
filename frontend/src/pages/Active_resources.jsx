import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ActiveResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get("/resources/active_resources/all");
      setResources(res.data.active_resources ?? res.data);
    } catch (err) {
      console.log("Failed to load resources", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Resources</h2>
        <button onClick={() => navigate("/")} className="bg-black text-white px-4 py-2 rounded-lg">Back to Home</button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="p-4">Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Capacity</th>
              <th className="p-4">Location</th>
              <th className="p-4">Amenities</th>
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No active resources found</td></tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource.id} className="border-b hover:bg-stone-50">
                  <td className="p-4 font-medium">{resource.resource_name}</td>
                  <td className="p-4 text-stone-600">{resource.type}</td>
                  <td className="p-4">{resource.capacity}</td>
                  <td className="p-4">{resource.location || "N/A"}</td>
                  <td className="p-4">{resource.amenities || "N/A"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}