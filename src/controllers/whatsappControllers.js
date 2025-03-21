const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'))

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
    try {
        const entry = req.body.entry[0]
        const changes =  entry.changes[0]
        const value = changes.value
        const messageObject = value.messages

        myConsole.log(messageObject)

        res.send('EVENT_RECEIVED')
    } catch (error) {
        myConsole.log(error)
        res.send('EVENT_RECEIVED')
        res.status(400).send('Invalid token')
    }
}

module.exports = {
    VerifyToken,
    ReceivedMessage
}
