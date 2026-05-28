import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function DeactivatedResources() {
  const navigate = useNavigate();
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchDeactivatedResources();
  }, []);

  const fetchDeactivatedResources = async () => {
    try {
     
      const res = await api.get("/resources/activate_resources/all");
      setResources(res.data.deactivated_resources ?? res.data);
    } catch (err) {
      console.error("Failed to load deactivated resources", err);
    }
  };

  const handleActivate = async (id) => {
    try {
      // Adjust this endpoint to match your actual backend route for activating a resource
      await api.put(`/resources/${id}/activate`);
      
      // Update the UI by filtering out the newly activated resource
      setResources((prevResources) => prevResources.filter((resource) => resource.id !== id));
    } catch (err) {
      console.error("Failed to activate resource", err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Deactivated Resources</h2>
        <button onClick={() => navigate("/resources")} className="bg-black text-white px-4 py-2 rounded-lg hover:bg-stone-800 transition">
          Back to Resources
        </button>
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
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-stone-500">
                  No deactivated resources found
                </td>
              </tr>
            ) : (
              resources.map((resource) => (
                <tr key={resource.id} className="border-b hover:bg-stone-50 transition">
                  <td className="p-4 font-medium">{resource.resource_name}</td>
                  <td className="p-4 text-stone-600">{resource.type}</td>
                  <td className="p-4">{resource.capacity}</td>
                  <td className="p-4">{resource.location || "N/A"}</td>
                  <td className="p-4">{resource.amenities || "N/A"}</td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleActivate(resource.id)}
                      className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-green-700 transition"
                    >
                      Activate
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}