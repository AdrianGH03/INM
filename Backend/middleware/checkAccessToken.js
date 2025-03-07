const axios = require('axios');
const { getNewAccessToken } = require('../controllers/authentication/authorizeUser');

async function checkAndRefreshToken(req, res, next) {
    let accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;

    if (!accessToken || !refreshToken) {
        return res.status(400).json({ error: 'Missing access or refresh token' });
    }

    try {
        await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        next();
    } catch (error) {
        if (error.response && error.response.status === 401) {
            try {
                accessToken = await getNewAccessToken(refreshToken);
                res.cookie('access_token', accessToken, { httpOnly: true, secure: true });
                req.cookies.access_token = accessToken; 
                next();
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError.message);
                res.status(401).json({ error: 'Failed to refresh access token' });
            }
        } else {
            console.error('Error with access token:', error.message);
            res.status(401).json({ error: 'Invalid access token' });
        }
    }
}

module.exports = checkAndRefreshToken;