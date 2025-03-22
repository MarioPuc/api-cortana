const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'))
const whatsappService = require('../services/whatsappService')

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

        if(typeof messageObject !== 'undefined') {
            const text = GetTextUser(messageObject[0])
            const phone = messageObject[0].from
            myConsole.log(messageObject[0])
            myConsole.log(text)

            whatsappService.SendMessageWhatsApp("user says: " + text, phone)
        }

        res.send('EVENT_RECEIVED')
    } catch (error) {
        myConsole.log(error)
        res.send('EVENT_RECEIVED')
        res.status(400).send('Invalid token')
    }
}

const GetTextUser = (messages) => {
    let text = ""
    const typeMessage = messages.type
    if(typeMessage === 'text') {
        text = messages.text.body
    } else if(typeMessage === 'interactive') {
        const interactiveObject = messages.interactive
        const typeInteractive = interactiveObject.type

        if(typeInteractive === 'button_reply') {
            text = interactiveObject.button_reply.title
        } else if(typeInteractive === 'list_reply') {
            text = interactiveObject.list.title
        } else {
            myConsole.log('Unknow message')
        }
    } else {
        myConsole.log('Unknow message')
    }
    return text
}

module.exports = {
    VerifyToken,
    ReceivedMessage
}
