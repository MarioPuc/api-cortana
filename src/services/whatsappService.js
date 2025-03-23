const https = require('https')
const fs = require('fs')
const myConsole = new console.Console(fs.createWriteStream('./logs.txt'))

function SendMessageWhatsApp(textResponse, phone) {
    normalizedPhone = normalizarNumeroWhatsApp(phone)
    myConsole.log("normalized phone: " + normalizedPhone)
    const data = JSON.stringify({
        "messaging_product": "whatsapp",
        "to": normalizedPhone,
        "type": "text",
        "text": {
            "body": textResponse
        }
    })

    const options = {
        host: 'graph.facebook.com',
        path: '/v22.0/532294676639352/messages',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer EAAJQx4IZByKgBOz24F8LMktSdsJBitbZCSmK9CmueLOvVckjDcxYxPXnqJX24QJqGhXcP5AKfuFyBWGPopPDJGWUY5GQZBNar8lxVn4tVZBh6CxZAhZCZCMi7EgzZCTBEW9DpjPRwZC9DJJLa2ysC3u8ZClIvNiJPcn0799pkLFV9a2zjnLqZCleT3UZAhbwHB9DuqCzUAZDZD',
            'Content-Length': Buffer.byteLength(data)
        }
    }

    const req = https.request(options, (res) => {
        let response = '';
        res.on('data', (chunk) => {
            response += chunk
        });
        res.on('end', () => {
            myConsole.log(`Status: ${res.statusCode}`)
            myConsole.log(`Response: ${response}`)
        });
    });

    req.on("error", (error) => {
        console.error('Error en la solicitud HTTPS:', error);
        myConsole.log('Error: ' + error.message);
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