import React from "react";
import { useNavigate } from "react-router";
import { Star, Clock, Bike, ChevronRight, UtensilsCrossed, Package } from "lucide-react";
import { restaurants } from "../data/restaurants";
import { useApp } from "../context/AppContext";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useApp();

  const handleSelectRestaurant = (restaurantId: string) => {
    if (!user) {
      navigate(`/registro?restaurant=${restaurantId}`);
    } else {
      navigate(`/chat/${restaurantId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={22} className="text-white" />
            </div>
            <div>
              <span className="text-gray-900 block" style={{ fontSize: "1.1rem", fontWeight: 700 }}>
                FoodBot
              </span>
              <span className="text-gray-500" style={{ fontSize: "0.7rem" }}>Tu asistente de pedidos</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate("/mis-pedidos")}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
                  style={{ fontSize: "0.82rem" }}
                >
                  <Package size={14} />
                  <span className="hidden sm:inline">Mis pedidos</span>
                </button>
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <span className="text-amber-700" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 hidden sm:block" style={{ fontSize: "0.9rem" }}>
                  Hola, {user.name.split(" ")[0]}
                </span>
              </div>
            ) : (
              <button
                onClick={() => navigate("/registro")}
                className="bg-amber-400 hover:bg-amber-500 text-white px-4 py-2 rounded-lg transition-colors"
                style={{ fontSize: "0.9rem" }}
              >
                Registrarse
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-12 pb-8 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full mb-4" style={{ fontSize: "0.85rem" }}>
          <span>🤖</span>
          <span>Chatbot inteligente de pedidos</span>
        </div>
        <h1 className="text-gray-900 mb-3" style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 }}>
          ¿Qué quieres comer hoy?
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto" style={{ fontSize: "1.05rem" }}>
          Elige tu restaurante favorito, haz tu pedido a través del chatbot y recíbelo en la puerta de tu casa.
        </p>
      </section>

      {/* Restaurant Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <h2 className="text-gray-800 mb-6" style={{ fontSize: "1.3rem", fontWeight: 600 }}>
          🍴 Restaurantes disponibles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => handleSelectRestaurant(restaurant.id)}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-white"
                  style={{ backgroundColor: restaurant.color, fontSize: "0.78rem", fontWeight: 600 }}
                >
                  {restaurant.cuisine}
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151" }}>{restaurant.rating}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-gray-900" style={{ fontSize: "1.15rem", fontWeight: 700 }}>
                    {restaurant.name}
                  </h3>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: restaurant.accentColor }}
                  >
                    <ChevronRight size={16} style={{ color: restaurant.color }} />
                  </div>
                </div>
                <p className="text-gray-500 mb-4" style={{ fontSize: "0.85rem" }}>
                  {restaurant.tagline}
                </p>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-gray-500" style={{ fontSize: "0.8rem" }}>
                    <Clock size={14} />
                    <span>{restaurant.deliveryTime}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500" style={{ fontSize: "0.8rem" }}>
                    <Bike size={14} />
                    <span>${restaurant.deliveryFee.toLocaleString("es-CO")} domicilio</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {restaurant.categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: restaurant.accentColor,
                        color: restaurant.color,
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      {cat.emoji} {cat.name}
                    </span>
                  ))}
                </div>

                <button
                  className="mt-4 w-full py-2.5 rounded-xl text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: restaurant.color, fontSize: "0.9rem", fontWeight: 600 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectRestaurant(restaurant.id);
                  }}
                >
                  🤖 Hacer pedido
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-gray-800 mb-8" style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            ¿Cómo funciona?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { step: "1", icon: "👤", title: "Regístrate", desc: "Crea tu cuenta en segundos" },
              { step: "2", icon: "🍴", title: "Elige restaurante", desc: "Selecciona entre 4 opciones" },
              { step: "3", icon: "🤖", title: "Pide con el bot", desc: "El chatbot te guía" },
              { step: "4", icon: "📍", title: "Rastrea tu pedido", desc: "Sigue tu pedido en tiempo real" },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <span className="text-amber-500" style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                  PASO {item.step}
                </span>
                <span className="text-gray-800" style={{ fontSize: "0.9rem", fontWeight: 600 }}>
                  {item.title}
                </span>
                <span className="text-gray-500 text-center" style={{ fontSize: "0.78rem" }}>
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}