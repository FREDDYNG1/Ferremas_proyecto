class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleProductoConsulta = () => {
    const message = this.createChatBotMessage("Puedes ver todos los productos haciendo clic en 'Ver Catálogo' arriba 👆.");
    this.updateChatbotState(message);
  };

  handleDefault = () => {
    const message = this.createChatBotMessage("Lo siento, no entendí eso. ¿Podrías intentar con otra frase?");
    this.updateChatbotState(message);
  };

  updateChatbotState(message) {
    this.setState(prev => ({ ...prev, messages: [...prev.messages, message] }));
  }
}

export default ActionProvider;
