import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("/bookings/upcoming_bookings");
      setBookings(res.data.bookings ?? res.data);
    } catch (err) {
      console.log("Failed to load bookings", err);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((booking) => booking.id !== id));
      alert("Booking cancelled");
    } catch (err) {
      console.log(err);
      alert("Failed to cancel booking");
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Bookings</h2>
        <button onClick={() => navigate("/booking")} className="bg-black text-white px-4 py-2 rounded-lg">Back to Booking</button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-100 border-b">
              <th className="p-4">Title</th>
              <th className="p-4">Resource</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center">No bookings found</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-b hover:bg-stone-50">
                  <td className="p-4 font-medium">{booking.title}</td>
                  <td className="p-4 text-stone-600">{booking.resource_name}</td>
                  <td className="p-4">{booking.date}</td>
                  <td className="p-4">{booking.start_time} - {booking.end_time}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => cancelBooking(booking.id)} className="text-red-600 hover:text-red-800 font-medium">
                      Cancel
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
