import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';

import { UserContext } from './contexts/UserContext';
import { AppRoutes } from './routes/AppRoutes';

import './assets/styles/App.css';
import Header from './components/Layout/Header';

function App() {
    const [profile, setProfile] = useState(null);

    return (
        <UserContext.Provider value={{ profile, setProfile }}>
            <Router>
                <HomeWrapper />
            </Router>
        </UserContext.Provider>
    );
}

function HomeWrapper() {
    const { profile, setProfile } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/profile', {
                    credentials: 'include'
                });
                if (!response.ok) {
                    navigate('/');
                }
                const data = await response.json();
                setProfile(data);
                console.log('Profile fetched:', data);
                 
            } catch (error) {
                if(error.status === 401){
                    navigate('/')
                }
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);


    return (
        <div className='app-container'>
            <Header profile={profile} />
            <AppRoutes />
        </div>
    );
}

export default App;