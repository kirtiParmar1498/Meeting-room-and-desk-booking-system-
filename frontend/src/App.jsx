import React from 'react'

import Registration from './pages/registration.jsx';
import Login from './pages/login.jsx';
import Booking from './pages/Booking.jsx';
import ResourceManagemnt from './pages/resource_management.jsx';
import AllBookings from './pages/All_bookings.jsx';
import { BrowserRouter,Routes, Route } from 'react-router-dom';
import PrivateRoute from './Private_route.jsx';
import MyBookings from './pages/My_bookings.jsx';
import ActiveResources from './pages/Active_resources.jsx';
import Availability from './pages/check_availabilty.jsx';
import DeactivatedResources from './pages/Deactivated_resources.jsx';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Registration/>} />
                <Route path="/booking" element={
                    <PrivateRoute>
                        <Booking/>
                    </PrivateRoute>
                } />
                <Route path="/resources" element={
                    <PrivateRoute>
                        <ResourceManagemnt/>
                    </PrivateRoute>
                } />
                <Route path="/all-bookings" element={
                    <PrivateRoute>
                        <AllBookings/>
                    </PrivateRoute>
                } />
                <Route path="/my-bookings" element={
                    <PrivateRoute>
                        <MyBookings/>
                    </PrivateRoute>
                } />
               
                <Route path ="/active_resources" element={
                    <PrivateRoute>
                        <ActiveResources/>
                    </PrivateRoute>
                } />
                <Route path="/availability" element={
                    <PrivateRoute>
                        <Availability/>
                    </PrivateRoute>
                } />
                <Route path="/deactivated_resources" element={
                    <PrivateRoute>
                        <DeactivatedResources/>
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
