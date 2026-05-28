import { useEffect, useState } from "react";
import api from "../api";

export default function AllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedResourceType, setSelectedResourceType] =
    useState("");

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await api.get("/bookings/resources", {
        params: {
          booking_date: selectedDate || undefined,
          resource_type: selectedResourceType || undefined,
        },
      });

      setBookings(response.data.bookings ?? response.data);
    } catch (error) {
      console.log("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, selectedResourceType]);

  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  
  const formatTime = (time) => {
    return time?.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
    
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800">
          All Bookings
        </h1>

        <p className="text-gray-500 mt-1">
          View and filter all bookings
        </p>
      </div>

      
      <div className="bg-white p-5 rounded-2xl shadow-md mb-6 flex flex-col md:flex-row gap-4">
        
        <div className="flex flex-col w-full md:w-64">
          <label className="mb-1 font-medium text-gray-700">
            Filter by Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(e.target.value)
            }
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

       
        <div className="flex flex-col w-full md:w-64">
          <label className="mb-1 font-medium text-gray-700">
            Filter by Resource Type
          </label>

          <select
            value={selectedResourceType}
            onChange={(e) =>
              setSelectedResourceType(e.target.value)
            }
            className="border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">
              All Types
            </option>
            <option value="room">Room</option>
            <option value="desk">Desk</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedDate("");
              setSelectedResourceType("");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg"
          >
            Clear Filters
          </button>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-200">
            <tr>
              <th className="p-4 text-left">
                Booking ID
              </th>

              <th className="p-4 text-left">
                User
              </th>

              <th className="p-4 text-left">
                Resource
              </th>

              <th className="p-4 text-left">
                Type
              </th>

              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Start Time
              </th>

              <th className="p-4 text-left">
                End Time
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4">
                  {booking.id}
                </td>

                <td className="p-4">
                  {booking.user_id || "N/A"}
                </td>

                <td className="p-4">
                  {booking.resource_name || "N/A"}
                </td>

                <td className="p-4 capitalize">
                  {booking.resource_type || "N/A"}
                </td>

                <td className="p-4">
                  {formatDate(
                    booking.date
                  )}
                </td>

                <td className="p-4">
                  {formatTime(
                    booking.start_time
                  )}
                </td>

                <td className="p-4">
                  {formatTime(
                    booking.end_time
                  )}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      booking.status ===
                      "confirmed"
                        ? "bg-green-100 text-green-700"
                        : booking.status ===
                          "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        
        {loading && (
          <div className="p-6 text-center text-gray-500">
            Loading bookings...
          </div>
        )}

        
        {!loading &&
          bookings.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No bookings found
            </div>
          )}
      </div>
    </div>
  );
}
