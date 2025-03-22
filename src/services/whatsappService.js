const https = require('https')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'))

function SendMessageWhatsApp(textResponse, phone) {
    normalizedPhone = normalizarNumeroWhatsApp(phone)
    myConsole.log("normalized phone: " + normalizedPhone)
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": normalizedPhone,
        "type": "text",
        "text": {
            "body": textResponse
            },
    })

    const options = {
        host: 'graph.facebook.com',
        path: '/v22.0/532294676639352/messages',
        method: 'POST',
        body: data,
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer EAAJQx4IZByKgBO7p3pInc5UCNQMulgZBpfQAFzmJ4lK3n1N1FIg6XVRqOtIxZCdckChB2zNRO8mjCsecmo64YbI8eoQe4iHqp1TFRw7u8ZBFury9aGQOwBKvRgf4uMaIVwZCL3pWTf4AD5nDB4zzXVyBLAMZCEdWmIvMdj9U0fxAnvTSpAPMFSwrJNdWz5a3bXCkbMVAJNwh5l1vNKM2II267MhGIZD'
        }
    }

    const req = https.request(options, (res) => {
        res.on("data", (chunk) => {
            process.stdout.write(chunk)
        })
    })

    req.on("error", (error) => {
        console.error(error)
    })

    req.write(data)
    req.end()
}

function normalizarNumeroWhatsApp(from) {
    if (!from.startsWith("52")) return from
    let resto = from.slice(2)
    if (resto.startsWith("1") && resto.length === 11) {
      resto = resto.slice(1)
    }
    return "52" + resto;
  }

module.exports = {
    SendMessageWhatsApp
}