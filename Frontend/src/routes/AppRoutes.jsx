import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from '../Home'

export function AppRoutes(){
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            
        </Routes>
    );
}