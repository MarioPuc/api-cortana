const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Contexto del asesor de ventas
const salesContext = `Eres un asesor de ventas experto y amable. 
Tu objetivo es ayudar a los clientes a encontrar los productos que mejor se adapten a sus necesidades.
Actualmente manejamos los siguientes productos:

1. Producto A - $100
   Descripción: Producto premium con características avanzadas
   
2. Producto B - $75
   Descripción: Producto estándar con buen balance calidad-precio
   
3. Producto C - $50
   Descripción: Producto básico ideal para necesidades simples

Siempre mantén un tono profesional pero cercano, y enfócate en entender las necesidades del cliente para recomendar el producto más adecuado.`;

// Almacenamiento de historial de conversaciones
const conversationHistory = new Map();

// Función para obtener el historial de conversación de un usuario
const getConversationHistory = (phoneNumber) => {
    if (!conversationHistory.has(phoneNumber)) {
        conversationHistory.set(phoneNumber, [
            { role: "system", content: salesContext }
        ]);
    }
    return conversationHistory.get(phoneNumber);
};

// Función para limpiar el historial de una conversación
const clearConversationHistory = (phoneNumber) => {
    conversationHistory.delete(phoneNumber);
};

// Función para agregar un mensaje al historial
const addMessageToHistory = (phoneNumber, role, content) => {
    const history = getConversationHistory(phoneNumber);
    history.push({ role, content });
    
    // Limitar el historial a los últimos 10 mensajes para evitar que crezca demasiado
    if (history.length > 10) {
        history.splice(1, history.length - 10); // Mantener el mensaje del sistema y los últimos 9 mensajes
    }
};

const getAIResponse = async (userMessage, phoneNumber) => {
    try {
        // Obtener el historial de conversación
        const messages = getConversationHistory(phoneNumber);
        
        // Agregar el nuevo mensaje del usuario al historial
        addMessageToHistory(phoneNumber, "user", userMessage);

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7,
            max_tokens: 150
        });

        const aiResponse = completion.choices[0].message.content;
        
        // Agregar la respuesta del asistente al historial
        addMessageToHistory(phoneNumber, "assistant", aiResponse);

        return aiResponse;
    } catch (error) {
        console.error('Error al obtener respuesta de OpenAI:', error);
        return "Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta de nuevo más tarde.";
    }
};

module.exports = {
    getAIResponse,
    clearConversationHistory
}; 