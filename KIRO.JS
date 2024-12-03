document.addEventListener("DOMContentLoaded", () => {
    const chatBody = document.getElementById("chatBody");
    const userInput = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    const emotionModal = document.getElementById("emotionModal");

    // Respuestas según estado de ánimo
    const emotionResponses = {
        happy: "¡Me alegra saber que estás feliz! 😊 Si necesitas ayuda con algo, estoy aquí para ti.",
        sad: "Lamento que te sientas así 😔. Estoy aquí para escucharte y ayudarte en lo que pueda.",
        neutral: "Gracias por compartir cómo te sientes. Estoy aquí si necesitas algo."
    };

    // Añadir mensajes al chat
    const addMessage = (text, isBot = true) => {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message", isBot ? "bot-message" : "user-message");
        messageDiv.textContent = text;
        chatBody.appendChild(messageDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    };

    // Cerrar modal y responder según emoción
    const handleEmotionClick = (emotion) => {
        emotionModal.style.display = "none";
        addMessage(emotionResponses[emotion]);
    };

    // Configurar clic en emociones
    document.getElementById("happy").addEventListener("click", () => handleEmotionClick("happy"));
    document.getElementById("sad").addEventListener("click", () => handleEmotionClick("sad"));
    document.getElementById("neutral").addEventListener("click", () => handleEmotionClick("neutral"));

    // Enviar mensaje
    const handleSend = async () => {
        const userText = userInput.value.trim();
        if (userText) {
            addMessage(userText, false);
            userInput.value = "";

            // Llamar a Dialogflow para obtener la respuesta
            try {
                const response = await fetch('https://dialogflow.cloud.google.com/v1/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer TU_TOKEN_DE_ACCESO' // Reemplaza con tu token de acceso
                    },
                    body: JSON.stringify({
                        queryInput: {
                            text: {
                                text: userText,
                                languageCode: 'es'
                            }
                        }
                    })
                });

                const responseData = await response.json();
                const botResponse = responseData.queryResult.fulfillmentText;
                addMessage(botResponse);

            } catch (error) {
                addMessage('Lo siento, hubo un error al procesar tu solicitud. Por favor, intenta nuevamente.');
            }
        }
    };

    sendBtn.addEventListener("click", handleSend);
    userInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });
});
