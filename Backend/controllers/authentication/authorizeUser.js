const axios = require('axios');
const { LocalStorage } = require('node-localstorage');
const localStorage = new LocalStorage('./scratch');
require('dotenv').config();
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

async function authorizeUser(req, res) {
    const params = new URLSearchParams(req.query);
    const code = params.get("code");

    if (!code) {
        await redirectToLogin(clientId, res);
    } else {
        const { access_token, refresh_token } = await getAccessToken(clientId, clientSecret, code);

        if (!access_token || !refresh_token) {
            return res.status(400).json({ error: 'Failed to obtain access or refresh token' });
        }

        res.cookie('access_token', access_token, { httpOnly: true, secure: true });
        res.cookie('refresh_token', refresh_token, { httpOnly: true, secure: true });
        res.redirect(`https://inm-25.vercel.app/home`);
    }
}

async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Buffer.from(digest).toString('base64')
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

function generateCodeVerifier(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

async function getAccessToken(clientId, clientSecret, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "https://inmbe.vercel.app/callback");
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token, refresh_token } = await result.json();
    return { access_token, refresh_token };
}

async function getNewAccessToken(refreshToken) {
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("client_secret", clientSecret);
    params.append("grant_type", "refresh_token");
    params.append("refresh_token", refreshToken);

    const result = await axios.post("https://accounts.spotify.com/api/token", params, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    const { access_token } = result.data;
    return access_token;
}

async function redirectToLogin(clientId, res) {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "https://inmbe.vercel.app/callback");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    res.redirect(`https://accounts.spotify.com/authorize?${params.toString()}`);
}

async function getProfile(accessToken) {
    try {
        const result = await fetch("https://api.spotify.com/v1/me", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        if (result.status === 401) {
            throw new Error('Expired token');
        }
        return await result.json();
    } catch (error) {
        if (error.message === 'Expired token') {
            const err = new Error('Expired token');
            err.status = 401;
            throw err;
        }
        throw error;
    }
}

module.exports = { authorizeUser, getProfile, getNewAccessToken };