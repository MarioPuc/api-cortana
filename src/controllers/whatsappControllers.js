const VerifyToken = (req, res, next) => {
    res.send('Token verified')
}

const ReceivedMessage = (req, res) => {
    res.send('Message received')
}

module.exports = {
    VerifyToken,
    ReceivedMessage
}
