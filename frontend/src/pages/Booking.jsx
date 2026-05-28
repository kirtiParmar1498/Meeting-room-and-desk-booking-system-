import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function Booking() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [resources, setResources] = useState([]);
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [form, setForm] = useState({
    title: "",
    resource_name: "",
    resource_id: "",
    date: "",
    start_time: "",
    end_time: "",
    status: "confirmed",
  });

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => {
      setToast({ msg: "", visible: false });
    }, 3000);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await api.get("/resources/active_resources/all");
      setResources(res.data.active_resources ?? res.data);
    } catch (err) {
      console.log(err);
      showToast("Failed to load resources");
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleResourceChange = (e) => {
    const selectedResource = resources.find(
      (resource) => String(resource.id) === e.target.value
    );

    setForm((prev) => ({
      ...prev,
      resource_id: e.target.value,
      resource_name: selectedResource?.resource_name ?? "",
    }));
  };




  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.end_time <= form.start_time) {
      showToast("End time must be after start time");
      return;
    }

    const bookingData = {
      title: form.title,
      resource_name: form.resource_name,
      resource_id: Number(form.resource_id),
      date: form.date,
      start_time: form.start_time,
      end_time: form.end_time,
      status: form.status,
    };

    try {
      await api.post("/bookings/", bookingData);
      showToast("Booking created successfully!");

      setTimeout(() => {
        navigate("/my-bookings");
      }, 1500);

    } catch (err) {
      console.log(err);
      if (err.response?.data?.detail) {
        showToast(err.response.data.detail);
      } else {
        showToast("Booking failed");
      }
    }
  };

  const fieldClass =
    "w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-stone-800 placeholder-stone-400 shadow-sm";

  const navBtnClass =
    "w-full text-left px-6 py-3.5 rounded-xl font-medium text-lg transition-all flex items-center justify-between border backdrop-blur-md shadow-sm ";

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center"
      style={{
        // Changed to a fresh, new light aesthetic workspace background
        backgroundImage: "url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop')"
      }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-0"></div>

      <div>
         {toast.visible && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-stone-900/90 backdrop-blur-md border border-stone-700 text-white px-6 py-4 rounded-full shadow-2xl flex items-center space-x-3 transition-all">
            <span className="text-amber-500 text-xl">✨</span>
            <span className="font-medium">{toast.msg}</span>
          </div>
        </div>
      )}
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 h-full">

        {/* LEFT COLUMN: Branding & Navigation */}
        <div className="flex flex-col justify-center text-stone-900 space-y-8 py-10 lg:pr-10">

          <div>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-4 text-stone-900">
              Book<span className="text-amber-500">Space</span>
            </h1>
            <p className="text-lg text-stone-700 font-medium max-w-md leading-relaxed">
              Seamlessly manage your workspace. Book rooms, check resource availability, and organize your schedule all in one place.
            </p>
          </div>

          <div className="flex flex-col gap-4 max-w-md pt-2">
            <button
              onClick={() => navigate("/my-bookings")}
              className={navBtnClass + "bg-white/50 hover:bg-white/80 border-stone-200 hover:border-stone-300 text-stone-800"}
            >
              <span>📅 My Bookings</span>
              <span className="opacity-50">→</span>
            </button>

            <button
              onClick={() => navigate("/active_resources")}
              className={navBtnClass + "bg-white/50 hover:bg-white/80 border-stone-200 hover:border-stone-300 text-stone-800"}
            >
              <span>🏢 Active Resources</span>
              <span className="opacity-50">→</span>
            </button>
            <button
              onClick={() => navigate("/availability")}
              className={navBtnClass + "bg-white/50 hover:bg-white/80 border-stone-200 hover:border-stone-300 text-stone-800"}
            >
              <span>🔍 Check Availability</span>
              <span className="opacity-50">→</span>
            </button>

            <button
              onClick={() => navigate("/cancel-booking")}
              className={navBtnClass + "bg-white/50 hover:bg-white/80 border-stone-200 hover:border-stone-300 text-stone-800"}
            >
              <span>🛑 Cancel Booking</span>
              <span className="opacity-50">→</span>
            </button>

            <button
              onClick={() => navigate("/login")}
              className={navBtnClass + "bg-red-50 hover:bg-red-100 border-red-200 hover:border-red-300 text-red-600 mt-4"}
            >
              <span>🚪 Logout</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Booking Form */}
        <div className="flex justify-center items-center">
          <div className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl p-6 lg:p-8 shadow-2xl border border-white">
            <h2 className="text-2xl font-bold text-stone-900 mb-6">Create a Booking</h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block mb-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider">Booking Title</label>
                <input type="text" name="title" value={form.title} onChange={handleChange} required className={fieldClass} placeholder="E.g., Q3 Planning Meeting" />
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider">Resource</label>
                <select name="resource_id" value={form.resource_id} onChange={handleResourceChange} required className={fieldClass}>
                  <option value="">Select Resource</option>
                  {resources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.resource_name} ({resource.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider">Date</label>
                <input type="date" name="date" min={today} value={form.date} onChange={handleChange} required className={fieldClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider">Start Time</label>
                  <input type="time" name="start_time" value={form.start_time} onChange={handleChange} required className={fieldClass} />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-bold text-stone-600 uppercase tracking-wider">End Time</label>
                  <input type="time" name="end_time" value={form.end_time} onChange={handleChange} required className={fieldClass} />
                </div>
              </div>



              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setForm({ title: "", resource_name: "", resource_id: "", date: "", start_time: "", end_time: "", status: "confirmed" })}
                  className="w-1/3 border-2 border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-600 font-semibold py-2.5 rounded-xl transition-colors text-sm"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="w-2/3 bg-stone-900 hover:bg-black shadow-lg text-white font-bold py-2.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] text-sm"
                >
                  Confirm Booking
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>

      {/* TOAST NOTIFICATION */}
     
    </div>
  );
}