import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from '../Home'
import { StarterCode } from '../App';

export function AppRoutes(){
    return (
        <Routes>
            <Route path="/" element={<StarterCode />} />
            <Route path="/home" element={<Home />} />
            
        </Routes>
    );
}