import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft, CheckCircle, Clock, Bike, Home, UtensilsCrossed,
  MapPin, Phone, CreditCard, Package, ChevronRight
} from "lucide-react";
import { useApp, Order } from "../context/AppContext";
import { getRestaurantById } from "../data/restaurants";

const statusSteps: Array<{
  id: Order["status"];
  label: string;
  description: string;
  icon: React.ReactNode;
  time: number; // seconds to next status
}> = [
  { id: "received", label: "Pedido recibido", description: "Tu pedido fue confirmado", icon: <CheckCircle size={20} />, time: 15 },
  { id: "preparing", label: "En preparación", description: "El restaurante está preparando tu pedido", icon: <UtensilsCrossed size={20} />, time: 25 },
  { id: "on_the_way", label: "En camino", description: "Tu pedido está en camino", icon: <Bike size={20} />, time: 20 },
  { id: "delivered", label: "Entregado", description: "¡Tu pedido fue entregado!", icon: <Home size={20} />, time: 0 },
];

const statusOrder: Order["status"][] = ["received", "preparing", "on_the_way", "delivered"];

export default function TrackingPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useApp();

  const order = orders.find((o) => o.id === orderId);
  const restaurant = order ? getRestaurantById(order.restaurantId) : null;

  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!order) return;
    const idx = statusOrder.indexOf(order.status);
    setCurrentStepIdx(idx);
  }, [order]);

  useEffect(() => {
    if (!order) return;
    const idx = statusOrder.indexOf(order.status);
    if (idx >= statusSteps.length - 1) return;

    const step = statusSteps[idx];
    const totalMs = step.time * 1000;
    const intervalMs = 300;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      setProgress(Math.min((elapsed / totalMs) * 100, 100));
      if (elapsed >= totalMs) {
        clearInterval(timer);
        const nextStatus = statusOrder[idx + 1];
        updateOrderStatus(order.id, nextStatus);
        setProgress(0);
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [order?.status]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-5xl mb-4">😔</div>
          <h2 className="text-gray-800 mb-2" style={{ fontWeight: 700 }}>Pedido no encontrado</h2>
          <p className="text-gray-500 mb-6" style={{ fontSize: "0.9rem" }}>No pudimos encontrar este pedido</p>
          <button
            onClick={() => navigate("/")}
            className="bg-amber-400 text-white px-6 py-2.5 rounded-xl hover:bg-amber-500 transition-colors"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    );
  }

  const currentStatusIdx = statusOrder.indexOf(order.status);
  const isDelivered = order.status === "delivered";
  const accentColor = restaurant?.color || "#F59E0B";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/")} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-gray-900" style={{ fontWeight: 700, fontSize: "1.05rem" }}>
                Seguimiento de pedido
              </h1>
              <p className="text-gray-400" style={{ fontSize: "0.72rem" }}>#{order.id}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/mis-pedidos")}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
            style={{ fontSize: "0.82rem" }}
          >
            <Package size={15} />
            <span>Mis pedidos</span>
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Status Card */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{
            background: isDelivered
              ? "linear-gradient(135deg, #10B981, #059669)"
              : `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 mb-1" style={{ fontSize: "0.82rem" }}>Estado actual</p>
              <h2 className="text-white" style={{ fontWeight: 700, fontSize: "1.4rem" }}>
                {statusSteps[currentStatusIdx]?.label}
              </h2>
              <p className="text-white/80 mt-1" style={{ fontSize: "0.85rem" }}>
                {statusSteps[currentStatusIdx]?.description}
              </p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              {isDelivered ? (
                <span style={{ fontSize: "2rem" }}>🎉</span>
              ) : (
                <span style={{ fontSize: "2rem" }}>
                  {order.status === "received" ? "📋" : order.status === "preparing" ? "👨‍🍳" : "🛵"}
                </span>
              )}
            </div>
          </div>

          {!isDelivered && (
            <>
              <div className="bg-white/20 rounded-full h-2 mb-2 overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center gap-2 text-white/80" style={{ fontSize: "0.78rem" }}>
                <Clock size={12} />
                <span>Tiempo estimado: {order.estimatedTime}</span>
              </div>
            </>
          )}
        </div>

        {/* Steps Tracker */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
            Progreso del pedido
          </h3>
          <div className="space-y-1">
            {statusSteps.map((step, idx) => {
              const completed = idx < currentStatusIdx;
              const active = idx === currentStatusIdx;
              const pending = idx > currentStatusIdx;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        backgroundColor: completed ? accentColor : active ? accentColor : "#F3F4F6",
                        color: completed || active ? "white" : "#9CA3AF",
                      }}
                    >
                      {completed ? <CheckCircle size={18} /> : step.icon}
                    </div>
                    {idx < statusSteps.length - 1 && (
                      <div
                        className="w-0.5 h-8 mt-1 transition-all"
                        style={{ backgroundColor: completed ? accentColor : "#E5E7EB" }}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p
                      className="transition-all"
                      style={{
                        fontWeight: active ? 700 : completed ? 500 : 400,
                        color: pending ? "#9CA3AF" : "#1F2937",
                        fontSize: "0.9rem",
                      }}
                    >
                      {step.label}
                    </p>
                    <p className="text-gray-400" style={{ fontSize: "0.78rem" }}>
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
            📦 Detalle del pedido — {order.restaurantName}
          </h3>
          <div className="space-y-2.5 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{item.emoji}</span>
                  <span className="text-gray-700" style={{ fontSize: "0.88rem" }}>
                    {item.name}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: "#F3F4F6", fontSize: "0.72rem", color: "#6B7280" }}
                  >
                    x{item.quantity}
                  </span>
                </div>
                <span className="text-gray-700" style={{ fontSize: "0.88rem", fontWeight: 500 }}>
                  ${(item.price * item.quantity).toLocaleString("es-CO")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-1.5">
            <div className="flex justify-between text-gray-500" style={{ fontSize: "0.82rem" }}>
              <span>Subtotal</span>
              <span>${order.subtotal.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex justify-between text-gray-500" style={{ fontSize: "0.82rem" }}>
              <span>Domicilio</span>
              <span>${order.deliveryFee.toLocaleString("es-CO")}</span>
            </div>
            <div
              className="flex justify-between pt-2 border-t border-gray-100"
              style={{ fontSize: "1rem", fontWeight: 700 }}
            >
              <span className="text-gray-800">Total a pagar</span>
              <span style={{ color: accentColor }}>${order.total.toLocaleString("es-CO")}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-gray-700 mb-4" style={{ fontWeight: 600, fontSize: "0.9rem" }}>
            🏠 Información de entrega
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin size={15} className="text-amber-500" />
              </div>
              <div>
                <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>Dirección</p>
                <p className="text-gray-800" style={{ fontSize: "0.88rem", fontWeight: 500 }}>{order.address}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={15} className="text-amber-500" />
              </div>
              <div>
                <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>Contacto</p>
                <p className="text-gray-800" style={{ fontSize: "0.88rem", fontWeight: 500 }}>
                  {order.user.name} — {order.user.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <CreditCard size={15} className="text-amber-500" />
              </div>
              <div>
                <p className="text-gray-500" style={{ fontSize: "0.75rem" }}>Método de pago</p>
                <p className="text-gray-800" style={{ fontSize: "0.88rem", fontWeight: 500 }}>{order.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-800 transition-all"
            style={{ fontSize: "0.88rem", fontWeight: 600 }}
          >
            ← Volver al inicio
          </button>
          <button
            onClick={() => navigate(`/chat/${order.restaurantId}`)}
            className="flex-1 py-3 rounded-xl text-white transition-opacity hover:opacity-90 flex items-center justify-center gap-2"
            style={{ backgroundColor: accentColor, fontSize: "0.88rem", fontWeight: 600 }}
          >
            🔁 Pedir de nuevo
          </button>
        </div>
      </div>
    </div>
  );
}
