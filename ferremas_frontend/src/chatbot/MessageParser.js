// src/chatbot/MessageParser.js
class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    // Aquí puedes agregar lógica para detectar intenciones, pero para tu caso:
    // Simplemente pasa el mensaje al método del ActionProvider
    this.actionProvider.handleUserMessage(message);
  }
}

export default MessageParser;
