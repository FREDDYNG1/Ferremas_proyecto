class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();

    if (lower.includes("producto") || lower.includes("catálogo")) {
      this.actionProvider.handleProductoConsulta();
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

export default MessageParser;
