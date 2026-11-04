import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AddCar from './addcar/AddCar.tsx';
import Dashboard from './dashboard/Dashboard.tsx';
import Home from './home/Home.tsx';
import Login from './login/Login.tsx';
import { ProtectedRoute } from './components/ProtectedRoute.tsx';
import Register from './register/Register.tsx';
import './App.css'
import Service from './service/Service.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route element={<ProtectedRoute />}><Route path="/dashboard" element={<Dashboard />}/></Route>
        <Route element={<ProtectedRoute />}><Route path="/addcar" element={<AddCar />}/></Route>
        <Route element={<ProtectedRoute />}><Route path="/service" element={<Service />}/></Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App
