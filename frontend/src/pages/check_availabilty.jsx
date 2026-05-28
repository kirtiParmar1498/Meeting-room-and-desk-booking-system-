import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Availability() {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];

    const [resources, setResources] = useState([]);
    const [form, setForm] = useState({ resource_id: "", date: "" });
    const [loading, setLoading] = useState(false);
    const [availability, setAvailability] = useState(null); 

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await api.get("/resources/active_resources/all");
            // Assuming your backend returns an array or an object with an array
            setResources(res.data.active_resources ?? res.data);
        } catch (err) {
            console.log("Failed to load resources", err);
        }
    };

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        // Clear previous results when the user changes inputs
        setAvailability(null);
    };

    const handleCheck = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAvailability(null);

        try {
            // FIXED: Passing resource_id and date as query parameters
            const res = await api.get(
                `/bookings/availability?resource_id=${form.resource_id}&date=${form.date}`
            );
            setAvailability(res.data);
        } catch (err) {
            console.log(err);
            alert("Failed to check availability. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const fieldClass =
        "w-full px-4 py-3 rounded-xl border border-stone-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-stone-800 shadow-sm";

    return (
        <div
            className="min-h-screen relative py-12 px-6 flex flex-col items-center bg-cover bg-center"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2000&auto=format&fit=crop')"
            }}
        >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-0"></div>

            <div className="relative z-10 w-full max-w-3xl flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold text-stone-900 drop-shadow-sm">Resource Availability</h2>
                    <p className="text-stone-700 font-medium mt-1">Select a resource and date to view its schedule.</p>
                </div>
                <button
                    onClick={() => navigate("/booking")}
                    className="bg-stone-900 hover:bg-black text-white px-5 py-2.5 rounded-xl transition-all shadow-lg"
                >
                    Back to Booking
                </button>
            </div>

            {/* Main Card */}
            <div className="relative z-10 bg-white/95 backdrop-blur-xl w-full max-w-3xl rounded-3xl p-8 shadow-2xl border border-white">

                {/* Search Form */}
                <form onSubmit={handleCheck} className="flex flex-col md:flex-row gap-4 items-end mb-8 border-b border-stone-100 pb-8">
                    <div className="w-full">
                        <label className="block mb-2 text-xs font-bold text-stone-600 uppercase tracking-wider">Resource</label>
                        {/* FIXED: Changed to a select dropdown mapping to resource_id */}
                        <select
                            name="resource_id"
                            value={form.resource_id}
                            onChange={handleChange}
                            required
                            className={fieldClass}
                        >
                            <option value="" disabled>Select a resource</option>
                            {resources.map((resource) => (
                                <option key={resource.id} value={resource.id}>
                                    {resource.resource_name || resource.name} {/* Adjust based on your DB schema */}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full">
                        <label className="block mb-2 text-xs font-bold text-stone-600 uppercase tracking-wider">Date</label>
                        <input type="date" name="date" min={today} value={form.date} onChange={handleChange} required className={fieldClass} />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !form.resource_id || !form.date}
                        className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
                    >
                        {loading ? "Checking..." : "Search"}
                    </button>
                </form>

                {availability && (
                    <div className="space-y-8 animate-fade-in-up">
                        {/* Free Slots */}
                        <div>
                            <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2 mb-4">
                                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                                Available Time Slots
                            </h3>
                            {availability.free_slots?.length === 0 ? (
                                <p className="text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-200">No available slots for this date.</p>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {availability.free_slots.map((slot, index) => (
                                        <div key={index} className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg font-medium shadow-sm">
                                            {slot.start_time} - {slot.end_time}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Taken Slots */}
                        <div>
                            <h3 className="text-lg font-bold text-stone-800 flex items-center gap-2 mb-4">
                                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                                Taken Time Slots
                            </h3>
                            {availability.taken_slots?.length === 0 ? (
                                <p className="text-stone-500 bg-stone-50 p-4 rounded-xl border border-stone-200">No bookings for this date yet.</p>
                            ) : (
                                <div className="flex flex-wrap gap-3">
                                    {availability.taken_slots.map((slot, index) => (
                                        <div key={index} className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg font-medium shadow-sm">
                                            {slot.start_time} - {slot.end_time}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}