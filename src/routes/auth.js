const express = require('express');
const axios = require('axios')
const router = express.Router();

router.post('/', async (req, res) => {
    const {username, password } = req.headers;
    try {
        if (!username || !password) return res.send({error:'Dados inválidos'});
        const api_signin_response = await axios.post(`${process.env.APIBASE}/users/v1/auth/signin`,{},{auth:{username:username, password:password}})
        const {access_token, refresh_token } = api_signin_response.data;
        const user_data = await axios.get(`${process.env.APIBASE}/users/v1/user/me`,{headers:{"Authorization":`Bearer ${access_token}`}});
        const final_data = JSON.parse(JSON.stringify(user_data.data));
        return res.send(final_data)
    } catch (error) {
        return res.send({error:error})
    }
});


module.exports = router;