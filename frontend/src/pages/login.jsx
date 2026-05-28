import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../assets/meeting room.jpg";
import api from "../api";

export default function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await api.post(
                "/auth/login",
                {
                    username: formData.username,
                    password: formData.password
                }
            );

            console.log(
                "Login successful:",
                response.data
            );

            

            localStorage.setItem(
                "token",
                response.data.access_token
            );

            
            if (response.data.role === "employee") {
                navigate("/booking");
            } else if (response.data.role === "admin") {
                navigate("/resources");
            }

            // navigate("/dashboard");

        } catch (error) {

            console.error(
                "Login failed:",
                error
            );

            if (error.response) {

                alert(
                    error.response.data.detail
                );

            } else {

                alert(
                    "Something went wrong"
                );
            }
        }
    };

    return (

        <div className="relative w-full h-screen overflow-hidden">

        

            <img
                src={bgImage}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover"
            />

        

            <div className="absolute inset-0 bg-black/40"></div>

        

            <div className="relative z-10 flex items-center justify-center h-full">

                <form
                    onSubmit={handleLogin}
                    className="w-[350px] bg-white backdrop-blur-lg border border-white/30 shadow-2xl rounded-2xl p-8 flex flex-col gap-5"
                >

                    <h1 className="text-3xl font-bold text-black text-center">
                        Login
                    </h1>

                

                    <div className="flex flex-col gap-1">

                        <label className="text-black font-medium">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                            className="p-3 rounded-lg outline-none border border-black bg-white/20 text-black placeholder:text-gray-200"
                            required
                        />

                    </div>

                    

                    <div className="flex flex-col gap-1">

                        <label className="text-black font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter password"
                            className="p-3 rounded-lg outline-none border border-black bg-white/20 text-black placeholder:text-gray-200"
                            required
                        />

                    </div>

                    

                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold py-3 rounded-lg"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}
