import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../views/Home';
import MainPage from '../views/MainPage';

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<MainPage />} />
        </Routes>
    );
}