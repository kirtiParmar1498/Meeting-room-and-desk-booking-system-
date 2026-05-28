import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/meeting room.jpg";
import api from "../api";

export default function Registration() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: ""
    });

    const handleRegistration = async (e) => {
        e.preventDefault();

        const userData = {
            username: formData.username,
            email: formData.email,
            password: formData.password,
            role: formData.role.toLowerCase()
        };

        try {
            const response = await api.post("/auth/register", userData);

            console.log("Registration successful:", response.data);
            alert("Registration Successful");
            setFormData({
                username: "",
                email: "",
                password: "",
                role: ""            
            }); 
            navigate("/booking");

        } catch (error) {
            console.error("Registration failed:", error);

            if (error.response?.data?.detail) {
                alert(error.response.data.detail);
            } else if (!error.response) {
                alert("Cannot connect to backend. Make sure FastAPI is running on http://127.0.0.1:8000.");
            } else {
                alert("Registration failed. Please try again.");
            }
        }
};

const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
        ...prev,
        [name]: value
    }));
};

return (
    <div className="relative w-full h-screen overflow-hidden">

        <img
            src={bgImage}
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-10 flex items-center justify-center h-full">

            <form
                onSubmit={handleRegistration}
                className="w-[350px] h-[530px] bg-white backdrop-blur-md border border-white/30 shadow-2xl rounded-2xl p-8 flex flex-col gap-5 "
            >

                <h1 className="text-2xl font-bold text-black text-center">
                    Registration
                </h1>

                <div className="flex flex-col gap-1">
                    <label className="text-black font-medium">
                        Username
                    </label>

                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        type="text"
                        placeholder="Enter username"
                        className="p-2 rounded-lg outline-none border border-black bg-white/20 text-black"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-black font-medium">
                        Email
                    </label>

                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="Enter email"
                        className="p-2 rounded-lg outline-none border border-black bg-white/20 text-black"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-black font-medium">
                        Password
                    </label>

                    <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type="password"
                        placeholder="Enter password"
                        className="p-2 rounded-lg outline-none border border-black bg-white/20 text-black"
                        minLength={6}
                        maxLength={72}
                        required
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-black font-medium">
                        Role
                    </label>

                    <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="p-2 rounded-lg outline-none border border-black bg-white/20 text-black"
                        required
                    >
                        <option value="">Select role</option>
                        <option value="employee">Employee</option>
                        
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-black font-semibold py-3 rounded-lg"
                >
                    Register
                </button>

                <p className="text-sm text-center text-black">
                    Already have an account/Admin?{" "}
                    <a
                        href="/login"
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </a>
                </p>

            </form>

        </div>
    </div>
);
}
