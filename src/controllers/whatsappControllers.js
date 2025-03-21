const VerifyToken = (req, res, next) => {
    try {
        const access_token = process.env.ACCESS_TOKEN
        const token = req.query["hub.verify_token"]
        const challenge = req.query["hub.challenge"]

        if(challenge !== null && token === access_token) {
            res.send(challenge)
        } else {
            res.status(401).send('Unauthorized')
        }
    } catch (error) {
        res.status(400).send('Invalid token')
    }
}

const ReceivedMessage = (req, res) => {
    res.send('Message received')
}

module.exports = {
    VerifyToken,
    ReceivedMessage
}
