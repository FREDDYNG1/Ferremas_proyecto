// src/chatbot/ActionProvider.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  async handleUserMessage(message) {
    try {
      const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "ferremas-chatbot"
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1-0528-qwen3-8b:free",
          messages: [
            {
              role: "system",
              content: "Eres un asistente que recomienda productos de ferretería según tareas del cliente.",
            },
            {
              role: "user",
              content: `¿Qué productos necesito para: ${message}? Responde con una sola categoría o palabra clave (ej: pintura, taladro, madera).`,
            },
          ],
          temperature: 0.5,
        }),
      });

      const data = await openRouterResponse.json();
      const categoria = data?.choices?.[0]?.message?.content?.trim()?.toLowerCase();

      if (!categoria) {
        this.updateChatbotState(this.createChatBotMessage("No se pudo entender la solicitud."));
        return;
      }

      const { data: productos, error } = await supabase
        .from("productos_producto")
        .select("*")
        .ilike("categoria", `%${categoria}%`);

      if (error) {
        this.updateChatbotState(this.createChatBotMessage("Hubo un error al buscar productos."));
        return;
      }

      if (!productos || productos.length === 0) {
        this.updateChatbotState(this.createChatBotMessage(`No encontré productos para "${categoria}".`));
        return;
      }

      const respuesta = productos
        .slice(0, 3)
        .map((p) => `🔧 ${p.nombre} - $${p.precio}`)
        .join("\n");

      this.updateChatbotState(this.createChatBotMessage(`Te recomiendo:\n${respuesta}`));
    } catch (err) {
      console.error("Error inesperado:", err);
      this.updateChatbotState(this.createChatBotMessage("Ocurrió un error al procesar tu solicitud."));
    }
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