import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Send, ShoppingCart, Trash2, Plus, Minus, ArrowLeft,
  MapPin, CreditCard, Banknote, Smartphone, X, CheckCircle, UtensilsCrossed, Package
} from "lucide-react";
import { useApp, CartItem, Order } from "../context/AppContext";
import { getRestaurantById, MenuItem } from "../data/restaurants";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text?: string;
  buttons?: { label: string; action: string }[];
  items?: MenuItem[];
  timestamp: Date;
}

type BotState =
  | "GREETING"
  | "CATEGORY_SELECTED"
  | "ITEM_SELECTED"
  | "ORDERING"
  | "CONFIRMING";

export default function ChatPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const navigate = useNavigate();
  const { user, cart, addToCart, removeFromCart, updateQuantity, clearCart, addOrder } = useApp();
  const restaurant = getRestaurantById(restaurantId || "");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [botState, setBotState] = useState<BotState>("GREETING");
  const [showCart, setShowCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Efectivo");
  const [address, setAddress] = useState(user?.address || "");
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cartSubtotal = cart.filter(i => i.restaurantId === restaurantId).reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = restaurant?.deliveryFee || 0;
  const cartTotal = cartSubtotal + deliveryFee;
  const restaurantCart = cart.filter((i) => i.restaurantId === restaurantId);

  useEffect(() => {
    if (!user) { navigate(`/registro?restaurant=${restaurantId}`); return; }
    if (!restaurant) { navigate("/"); return; }
    // Initial greeting
    setTimeout(() => {
      addBotMessage(
        `¡Hola, ${user.name.split(" ")[0]}! 👋 Soy tu asistente de *${restaurant.name}*.\n\n¿Qué te gustaría pedir hoy?`,
        restaurant.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
      );
    }, 400);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addBotMessage = (
    text: string,
    buttons?: { label: string; action: string }[],
    items?: MenuItem[]
  ) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "bot", text, buttons, items, timestamp: new Date() },
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), from: "user", text, timestamp: new Date() },
    ]);
  };

  const handleAction = (action: string, label: string) => {
    addUserMessage(label);

    if (action.startsWith("cat:")) {
      const catId = action.replace("cat:", "");
      const category = restaurant!.categories.find((c) => c.id === catId);
      const items = restaurant!.menu.filter((m) => m.category === catId);
      setBotState("CATEGORY_SELECTED");
      setTimeout(() => {
        addBotMessage(
          `¡Perfecto! Aquí está nuestra sección de *${category?.name}*. ¿Qué te apetece? 😋`,
          undefined,
          items
        );
      }, 300);

    } else if (action.startsWith("add:")) {
      const itemId = action.replace("add:", "");
      const item = restaurant!.menu.find((m) => m.id === itemId);
      if (item) {
        addToCart({
          id: item.id, name: item.name, price: item.price,
          emoji: item.emoji, quantity: 1, restaurantId: restaurantId!,
        });
        setTimeout(() => {
          addBotMessage(
            `✅ ¡Agregué *${item.name}* ($${item.price.toLocaleString("es-CO")}) a tu carrito!\n\n¿Deseas algo más?`,
            [
              ...restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` })),
              { label: "🛒 Ver carrito", action: "view:cart" },
            ]
          );
        }, 300);
      }

    } else if (action === "view:cart") {
      setShowCart(true);
      setTimeout(() => {
        if (restaurantCart.length === 0) {
          addBotMessage("Tu carrito está vacío. ¿Qué deseas pedir?",
            restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
          );
        } else {
          addBotMessage(
            `Tu carrito tiene ${restaurantCart.length} producto(s). Total: $${cartTotal.toLocaleString("es-CO")} (incluye $${deliveryFee.toLocaleString("es-CO")} de domicilio).\n\nPuedes confirmar o seguir agregando items.`,
            [
              ...restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` })),
              { label: "✅ Confirmar pedido", action: "confirm:order" },
            ]
          );
        }
      }, 300);

    } else if (action === "confirm:order") {
      setBotState("CONFIRMING");
      setShowCart(true);
      setTimeout(() => {
        addBotMessage(
          `¡Genial! Revisa tu carrito y confirma los datos de entrega. Cuando estés listo, haz clic en *Confirmar Pedido* en el panel del carrito. 🎉`
        );
      }, 300);
    }
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    setInputText("");
    addUserMessage(text);

    const lower = text.toLowerCase();
    setTimeout(() => {
      if (lower.includes("carrito") || lower.includes("pedido") || lower.includes("total")) {
        setShowCart(true);
        const total = cartTotal;
        if (restaurantCart.length === 0) {
          addBotMessage("Tu carrito está vacío. Elige una categoría para empezar:",
            restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
          );
        } else {
          addBotMessage(
            `🛒 Tienes ${restaurantCart.length} producto(s) en tu carrito.\nSubtotal: $${cartSubtotal.toLocaleString("es-CO")}\nDomicilio: $${deliveryFee.toLocaleString("es-CO")}\n*Total: $${total.toLocaleString("es-CO")}*`,
            [
              { label: "✅ Confirmar pedido", action: "confirm:order" },
              { label: "🗑️ Vaciar carrito", action: "clear:cart" },
            ]
          );
        }
      } else if (lower.includes("menu") || lower.includes("menú") || lower.includes("opciones")) {
        addBotMessage("¡Claro! Aquí están nuestras categorías:", 
          restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
        );
      } else if (lower.includes("hola") || lower.includes("buenas") || lower.includes("buenas")) {
        addBotMessage(
          `¡Hola de nuevo, ${user!.name.split(" ")[0]}! 😊 ¿Qué deseas pedir hoy?`,
          restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
        );
      } else if (lower.includes("confirmar") || lower.includes("confirma")) {
        handleAction("confirm:order", "Confirmar pedido");
      } else if (lower.includes("ayuda") || lower.includes("help")) {
        addBotMessage(
          `Puedo ayudarte con:\n• Ver el menú por categoría\n• Agregar items a tu carrito\n• Ver el total de tu pedido\n• Confirmar tu pedido\n\n¡Solo escríbeme o usa los botones!`,
          restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
        );
      } else {
        // Try to find a menu item by name
        const found = restaurant!.menu.filter((m) =>
          m.name.toLowerCase().includes(lower) || lower.includes(m.name.toLowerCase().split(" ")[0])
        );
        if (found.length > 0) {
          addBotMessage(`Encontré esto para ti:`, undefined, found);
        } else {
          addBotMessage(
            `No entendí tu mensaje 😅 Puedo ayudarte a pedir. ¿Qué categoría te interesa?`,
            restaurant!.categories.map((c) => ({ label: `${c.emoji} ${c.name}`, action: `cat:${c.id}` }))
          );
        }
      }
    }, 400);
  };

  const handleConfirmOrder = () => {
    if (restaurantCart.length === 0) return;
    if (!address.trim()) return;

    const orderId = `ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      restaurantId: restaurantId!,
      restaurantName: restaurant!.name,
      items: restaurantCart,
      subtotal: cartSubtotal,
      deliveryFee,
      total: cartTotal,
      address,
      paymentMethod,
      status: "received",
      createdAt: new Date(),
      estimatedTime: restaurant!.deliveryTime,
      user: user!,
    };
    addOrder(newOrder);
    clearCart();
    setOrderConfirmed(true);

    // Simulate status updates
    setTimeout(() => navigate(`/seguimiento/${orderId}`), 2000);
  };

  if (!restaurant || !user) return null;

  if (orderConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={44} className="text-green-500" />
          </div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700, fontSize: "1.4rem" }}>¡Pedido confirmado!</h2>
          <p className="text-gray-500">Redirigiendo al seguimiento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ maxHeight: "100dvh" }}>
      {/* Header */}
      <header className="bg-white shadow-sm z-40 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: restaurant.color }}
            >
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <h1 className="text-gray-900" style={{ fontSize: "1rem", fontWeight: 700 }}>
                {restaurant.name}
              </h1>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>{restaurant.cuisine} • 🟢 En línea</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/mis-pedidos")}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
              style={{ fontSize: "0.78rem" }}
            >
              <Package size={14} />
              <span className="hidden sm:inline">Mis pedidos</span>
            </button>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative flex items-center gap-1 px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: restaurant.color, fontSize: "0.85rem" }}
            >
              <ShoppingCart size={16} />
              <span>Carrito</span>
              {restaurantCart.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center" style={{ fontSize: "0.65rem", fontWeight: 700 }}>
                  {restaurantCart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category tabs */}
        <div className="max-w-6xl mx-auto px-4 pb-3 flex gap-2 overflow-x-auto">
          {restaurant.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleAction(`cat:${cat.id}`, `${cat.emoji} ${cat.name}`)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: restaurant.color, fontSize: "0.78rem", fontWeight: 600 }}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden max-w-6xl mx-auto w-full px-4 py-4 gap-4">
        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] ${msg.from === "user" ? "order-1" : ""}`}>
                  {msg.from === "bot" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-white"
                        style={{ backgroundColor: restaurant.color, fontSize: "0.8rem" }}
                      >
                        🤖
                      </div>
                      <span className="text-gray-400" style={{ fontSize: "0.72rem" }}>Bot de {restaurant.name}</span>
                    </div>
                  )}

                  {msg.text && (
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        msg.from === "user"
                          ? "text-white rounded-tr-sm"
                          : "bg-gray-100 text-gray-800 rounded-tl-sm"
                      }`}
                      style={{
                        backgroundColor: msg.from === "user" ? restaurant.color : undefined,
                        fontSize: "0.9rem",
                        lineHeight: 1.6,
                        whiteSpace: "pre-line",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\*(.*?)\*/g, "<strong>$1</strong>"),
                      }}
                    />
                  )}

                  {/* Item cards */}
                  {msg.items && msg.items.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {msg.items.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <span style={{ fontSize: "1.8rem" }}>{item.emoji}</span>
                            <div>
                              <p className="text-gray-800" style={{ fontSize: "0.85rem", fontWeight: 600 }}>{item.name}</p>
                              <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>{item.description}</p>
                              <p style={{ fontSize: "0.85rem", fontWeight: 700, color: restaurant.color }}>
                                ${item.price.toLocaleString("es-CO")}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAction(`add:${item.id}`, `Agregar ${item.name}`)}
                            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                            style={{ backgroundColor: restaurant.color }}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quick reply buttons */}
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.buttons.map((btn, i) => (
                        <button
                          key={i}
                          onClick={() => handleAction(btn.action, btn.label)}
                          className="px-3 py-1.5 rounded-full border transition-all hover:text-white"
                          style={{
                            borderColor: restaurant.color,
                            color: restaurant.color,
                            fontSize: "0.78rem",
                            fontWeight: 500,
                          }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = restaurant.color;
                            (e.currentTarget as HTMLButtonElement).style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                            (e.currentTarget as HTMLButtonElement).style.color = restaurant.color;
                          }}
                        >
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 p-3 flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Escribe un mensaje... (Ej: 'ver menú', 'mi carrito')"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-amber-400 bg-gray-50 focus:bg-white transition-all"
              style={{ fontSize: "0.9rem" }}
            />
            <button
              onClick={handleSend}
              className="w-11 h-11 rounded-xl flex items-center justify-center text-white transition-opacity hover:opacity-80"
              style={{ backgroundColor: restaurant.color }}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Cart panel (desktop: always visible, mobile: toggle) */}
        <div
          className={`${showCart ? "flex" : "hidden"} md:flex flex-col bg-white rounded-2xl shadow-sm overflow-hidden`}
          style={{ width: "340px", flexShrink: 0 }}
        >
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={18} style={{ color: restaurant.color }} />
              <h3 className="text-gray-800" style={{ fontWeight: 700, fontSize: "1rem" }}>Carrito</h3>
              {restaurantCart.length > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: restaurant.color, fontSize: "0.72rem", fontWeight: 600 }}
                >
                  {restaurantCart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </div>
            <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-gray-600 md:hidden">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {restaurantCart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🛒</div>
                <p className="text-gray-400" style={{ fontSize: "0.85rem" }}>Tu carrito está vacío</p>
                <p className="text-gray-300 mt-1" style={{ fontSize: "0.78rem" }}>¡Agrega items desde el chat!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {restaurantCart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <span style={{ fontSize: "1.4rem" }}>{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 truncate" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{item.name}</p>
                      <p style={{ fontSize: "0.8rem", color: restaurant.color, fontWeight: 600 }}>
                        ${(item.price * item.quantity).toLocaleString("es-CO")}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="w-6 text-center text-gray-700" style={{ fontSize: "0.82rem", fontWeight: 600 }}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-1 w-6 h-6 rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {restaurantCart.length > 0 && (
            <div className="p-4 border-t border-gray-100 space-y-3">
              {/* Delivery address */}
              <div>
                <label className="text-gray-600 mb-1 flex items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                  <MapPin size={12} />
                  Dirección de entrega
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Calle 5 #4-32"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-amber-400 bg-gray-50"
                  style={{ fontSize: "0.82rem" }}
                />
              </div>

              {/* Payment method */}
              <div>
                <label className="text-gray-600 mb-2 flex items-center gap-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                  <CreditCard size={12} />
                  Método de pago
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "Efectivo", icon: <Banknote size={13} />, label: "Efectivo" },
                    { id: "Tarjeta", icon: <CreditCard size={13} />, label: "Tarjeta" },
                    { id: "Transferencia", icon: <Smartphone size={13} />, label: "Transf." },
                  ].map((pm) => (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg border transition-all ${
                        paymentMethod === pm.id ? "border-amber-400 bg-amber-50 text-amber-600" : "border-gray-200 text-gray-500"
                      }`}
                      style={{ fontSize: "0.7rem" }}
                    >
                      {pm.icon}
                      {pm.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-1.5">
                <div className="flex justify-between text-gray-500" style={{ fontSize: "0.8rem" }}>
                  <span>Subtotal</span>
                  <span>${cartSubtotal.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-gray-500" style={{ fontSize: "0.8rem" }}>
                  <span>Domicilio</span>
                  <span>${deliveryFee.toLocaleString("es-CO")}</span>
                </div>
                <div className="flex justify-between text-gray-900 pt-1 border-t border-gray-200" style={{ fontSize: "0.95rem", fontWeight: 700 }}>
                  <span>Total</span>
                  <span style={{ color: restaurant.color }}>${cartTotal.toLocaleString("es-CO")}</span>
                </div>
              </div>

              <button
                onClick={handleConfirmOrder}
                disabled={!address.trim()}
                className="w-full py-3 rounded-xl text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: restaurant.color, fontWeight: 700, fontSize: "0.9rem" }}
              >
                ✅ Confirmar pedido
              </button>
              <button
                onClick={() => clearCart()}
                className="w-full py-2 rounded-xl border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 transition-all"
                style={{ fontSize: "0.82rem" }}
              >
                🗑️ Vaciar carrito
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile cart overlay button */}
      {!showCart && restaurantCart.length > 0 && (
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl text-white shadow-lg"
            style={{ backgroundColor: restaurant.color }}
          >
            <ShoppingCart size={18} />
            <span style={{ fontWeight: 700 }}>${cartTotal.toLocaleString("es-CO")}</span>
            <span
              className="bg-white rounded-full w-5 h-5 flex items-center justify-center"
              style={{ color: restaurant.color, fontSize: "0.7rem", fontWeight: 700 }}
            >
              {restaurantCart.reduce((s, i) => s + i.quantity, 0)}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
