const express = require('express');
const router = express.Router();
const { authorizeUser, getProfile } = require('../../controllers/authentication/authorizeUser');


router.get('/callback', authorizeUser);

router.get('/profile', async (req, res) => {
    const accessToken = req.cookies.access_token;
    if (!accessToken) {
        return res.status(401).send('Unauthorized');
    }

    try {
        const response = await getProfile(accessToken);
        res.json(response);
    } catch (error) {
        if (error.status === 401) {
            res.clearCookie('access_token');
            return res.status(401).send('Unauthorized or Expired Token');
        } else {
            console.error('Error fetching profile:', error);
            res.status(500).send('Error fetching profile');
        }
    }
});

module.exports = router;