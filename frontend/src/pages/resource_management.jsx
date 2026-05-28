import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function ResourceManagement() {
  const navigate = useNavigate();

  const [resources, setResources] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    resource_name: "",
    type: "room",
    capacity: "",
    amenities: "",
    location: "",
  });

  const fetchResources = async () => {
    try {
      const response = await api.get("/resources/");
      setResources(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      resource_name: "",
      type: "room",
      capacity: "",
      amenities: "",
      location: "",
    });
    setShowModal(true);
  };

  const openEditModal = (resource) => {
    setEditingId(resource.id);
    setFormData({
      resource_name: resource.resource_name,
      type: resource.type,
      capacity: resource.capacity,
      amenities: resource.amenities || "",
      location: resource.location || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        resource_name: formData.resource_name,
        type: formData.type,
        capacity: Number(formData.capacity),
        amenities: formData.amenities,
        location: formData.location,
      };

      if (editingId) {
        await api.put(`/resources/update/${editingId}`, payload);
      } else {
        await api.post("/resources/", payload);
      }

      await fetchResources();
      setShowModal(false);
      setFormData({
        resource_name: "",
        type: "room",
        capacity: "",
        amenities: "",
        location: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deactivateResource = async (id) => {
    try {
      await api.put(`/resources/deactivate/${id}`);
  
    } catch (error) {
      console.log(error);
    }
  };

  // const activateResource = async (id) => {
  //   try {
  //     await api.put(`/resources/activate_resources/${id}`);


  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Resource Management
        </h1>

        <div className="flex gap-3">
          <button
            onClick={() => navigate("/all-bookings")}
            className="bg-slate-700 hover:bg-slate-800 text-white px-5 py-2 rounded-lg"
          >
            All Bookings
          </button>

          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Add Resource
          </button>
           <button
            onClick={() => navigate("/deactivated_resources")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
          >
            Deactivated Resources
          </button>


          <div>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Capacity</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id} className="border-b hover:bg-slate-50">
                <td className="p-4">{resource.resource_name}</td>
                <td className="p-4 capitalize">{resource.type}</td>
                <td className="p-4">{resource.capacity}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      resource.is_active || resource.IsActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {resource.is_active || resource.IsActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => openEditModal(resource)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-1 rounded-lg"
                  >
                    Edit
                  </button>

                  {(resource.is_active || resource.IsActive) && (
                    <button
                      onClick={() => deactivateResource(resource.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
                    >
                      Deactivate
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {resources.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No resources found
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-5">
              {editingId ? "Edit Resource" : "Add Resource"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 h-[400px] overflow-y-auto"
            >
              <div>
                <label className="block mb-1 font-medium">Resource Name</label>
                <input
                  type="text"
                  name="resource_name"
                  value={formData.resource_name}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Resource Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="room">Room</option>
                  <option value="desk">Desk</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Amenities</label>
                <input
                  type="text"
                  name="amenities"
                  value={formData.amenities}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}