import { createChatBotMessage } from 'react-chatbot-kit';

const botName = "Asistente FERREMAS";

const config = {
  botName,
  initialMessages: [createChatBotMessage(`Hola 👋, soy ${botName}. ¿En qué puedo ayudarte?`)],
  customStyles: {
    botMessageBox: { backgroundColor: "#1976d2" },
    chatButton: { backgroundColor: "#1976d2" }
  }
};

export default config;
