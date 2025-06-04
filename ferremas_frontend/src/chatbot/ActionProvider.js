// Ferremas_proyecto/frontend/src/chatbot/ActionProvider.js
// Ferremas_proyecto/frontend/src/chatbot/ActionProvider.js
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

  handleUserMessage = async (message) => {
    try {
      // Paso 1: obtener la categoría desde OpenRouter
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

      if (!data?.choices || data.choices.length === 0) {
        console.error("Respuesta inválida de OpenRouter:", data);
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, this.createChatBotMessage("No se pudo entender la solicitud.")],
        }));
        return;
      }

      const categoria = data.choices[0].message.content.trim().toLowerCase();
      console.log("Categoría detectada:", categoria);

      // Paso 2: buscar productos en Supabase
      const { data: productos, error } = await supabase
        .from("productos_producto")
        .select("*")
        .ilike("categoria", `%${categoria}%`);

      if (error) {
        console.error("Error consultando Supabase:", error);
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, this.createChatBotMessage("Hubo un error al buscar productos.")],
        }));
        return;
      }

      if (!productos || productos.length === 0) {
        this.setState((prev) => ({
          ...prev,
          messages: [...prev.messages, this.createChatBotMessage(`No encontré productos para "${categoria}".`)],
        }));
        return;
      }

      const respuesta = productos
        .slice(0, 3)
        .map((p) => `🔧 ${p.nombre} - $${p.precio}`)
        .join("\n");

      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, this.createChatBotMessage(`Te recomiendo:\n${respuesta}`)],
      }));
    } catch (error) {
      console.error("Error inesperado:", error);
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, this.createChatBotMessage("Ocurrió un error al procesar tu solicitud.")],
      }));
    }
  };
}

export default ActionProvider;
