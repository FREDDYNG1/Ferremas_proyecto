// src/chatbot/ChatbotConfig.js
import { createChatBotMessage } from "react-chatbot-kit";
import ActionProvider from "./ActionProvider";
import MessageParser from "./MessageParser";

const botName = "FerremasBot";

const config = {
  initialMessages: [
    createChatBotMessage(`¡Hola! Soy ${botName}, tu asistente ferretero 🤖. Describe tu tarea y te recomendaré productos.`),
  ],
  botName,
  customStyles: {
    botMessageBox: {
      backgroundColor: "#007bff",
    },
    chatButton: {
      backgroundColor: "#007bff",
    },
  },
  state: {
    // Puedes agregar estados personalizados si deseas
  },
  customComponents: {
    // Agrega componentes personalizados si usas
  },
  actionProvider: ActionProvider,
  messageParser: MessageParser,
};

export default config;
// Este archivo configura el chatbot con un mensaje inicial y define el nombre del bot.
// También especifica los estilos personalizados y las clases de ActionProvider y MessageParser que manejarán las acciones y mensajes del chatbot.    