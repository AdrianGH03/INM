const { getProfile } = require('../controllers/authentication/authorizeUser');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');

async function validateAccessToken(req, res, next) {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
        return res.status(401).json({ error: 'No access token provided' });
    }

    try {
        const profile = await getProfile(accessToken);
        req.user = profile;
        next();
    } catch (error) {
        if (error.status === 401) {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                return res.status(401).json({ error: 'No refresh token available' });
            }

            try {
                const newAccessToken = await refreshAccessToken(refreshToken);
                res.cookie('access_token', newAccessToken, { httpOnly: true, secure: true });
                req.user = await getProfile(newAccessToken);
                next();
            } catch (refreshError) {
                return res.status(401).json({ error: 'Failed to refresh access token' });
            }
        } else {
            return res.status(500).json({ error: 'Failed to validate access token' });
        }
    }
}

async function refreshAccessToken(refreshToken) {
    const params = new URLSearchParams();
    params.append("client_id", process.env.SPOTIFY_CLIENT_ID);
    params.append("client_secret", process.env.SPOTIFY_CLIENT_SECRET);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    return access_token;
}

module.exports = validateAccessToken;