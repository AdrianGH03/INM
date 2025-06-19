import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../views/Home';
import MainPage from '../views/MainPage';

export function AppRoutes(props) {
    return (
        <Routes>
            <Route path="/home" element={<Home {...props} />} />
            <Route path="/" element={<MainPage />} />
        </Routes>
    );
}