const { default: axios } = require("axios");
const express = require("express");
const router = express.Router();

const jokeUrl = process.env.JOKE_API_URL;

router.get("/", async function (req, res) {
    const {type, amount} = req.query;
    const calAmt = Number(amount) > 10  ? 10 : Number(amount) < 5 ? 5 : amount
    const config = {
        params: {
            type: type ?? 'single',
            amount: calAmt ?? 10
        }
    };
    const result = await axios.get(jokeUrl, config);
    res.json(result?.data);
});

module.exports = router;