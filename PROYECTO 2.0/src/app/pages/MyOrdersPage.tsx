import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Clock, CheckCircle, Bike, UtensilsCrossed, Package, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getRestaurantById } from "../data/restaurants";

const statusConfig = {
  received: { label: "Recibido", color: "#6B7280", bg: "#F3F4F6", icon: "📋" },
  preparing: { label: "Preparando", color: "#F59E0B", bg: "#FEF3C7", icon: "👨‍🍳" },
  on_the_way: { label: "En camino", color: "#3B82F6", bg: "#DBEAFE", icon: "🛵" },
  delivered: { label: "Entregado", color: "#10B981", bg: "#D1FAE5", icon: "✅" },
};

export default function MyOrdersPage() {
  const navigate = useNavigate();
  const { orders, user } = useApp();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700 }}>No has iniciado sesión</h2>
          <p className="text-gray-500 mb-6" style={{ fontSize: "0.9rem" }}>Debes registrarte para ver tus pedidos</p>
          <button
            onClick={() => navigate("/registro")}
            className="bg-amber-400 text-white px-6 py-2.5 rounded-xl hover:bg-amber-500 transition-colors"
          >
            Registrarse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
              Mis pedidos
            </h1>
            <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>
              {orders.length} pedido(s) en total
            </p>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={36} className="text-gray-300" />
            </div>
            <h3 className="text-gray-600 mb-2" style={{ fontWeight: 600 }}>No tienes pedidos aún</h3>
            <p className="text-gray-400 mb-6" style={{ fontSize: "0.85rem" }}>
              ¡Haz tu primer pedido con nuestros restaurantes!
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-amber-400 text-white px-6 py-2.5 rounded-xl hover:bg-amber-500 transition-colors"
            >
              Ver restaurantes
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const restaurant = getRestaurantById(order.restaurantId);
              const status = statusConfig[order.status];
              const isActive = order.status !== "delivered";
              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => navigate(`/seguimiento/${order.id}`)}
                >
                  {/* Top bar */}
                  {isActive && (
                    <div
                      className="h-1"
                      style={{ backgroundColor: restaurant?.color || "#F59E0B" }}
                    />
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                          style={{ backgroundColor: restaurant?.color || "#F59E0B" }}
                        >
                          <UtensilsCrossed size={18} />
                        </div>
                        <div>
                          <p className="text-gray-800" style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                            {order.restaurantName}
                          </p>
                          <p className="text-gray-400" style={{ fontSize: "0.75rem" }}>
                            #{order.id} • {new Date(order.createdAt).toLocaleDateString("es-CO", {
                              day: "numeric", month: "short", year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-1 rounded-full flex items-center gap-1"
                          style={{ backgroundColor: status.bg, color: status.color, fontSize: "0.75rem", fontWeight: 600 }}
                        >
                          <span>{status.icon}</span>
                          {status.label}
                        </span>
                        <ChevronRight size={16} className="text-gray-300" />
                      </div>
                    </div>

                    {/* Items preview */}
                    <div className="flex gap-1 flex-wrap mb-3">
                      {order.items.slice(0, 3).map((item, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-600"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {item.emoji} {item.name} x{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded-full text-gray-400" style={{ fontSize: "0.75rem" }}>
                          +{order.items.length - 3} más
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gray-400" style={{ fontSize: "0.78rem" }}>
                        <Clock size={12} />
                        <span>{order.estimatedTime}</span>
                        <span className="mx-1">•</span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "1rem", color: restaurant?.color || "#F59E0B" }}>
                        ${order.total.toLocaleString("es-CO")}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
