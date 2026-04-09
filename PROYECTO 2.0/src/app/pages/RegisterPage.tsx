import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { User, Phone, Mail, MapPin, ArrowLeft, CheckCircle, UtensilsCrossed } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const restaurantId = searchParams.get("restaurant");
  const { setUser, user } = useApp();

  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.phone.trim()) newErrors.phone = "El teléfono es requerido";
    else if (!/^\d{7,15}$/.test(form.phone.replace(/\s/g, "")))
      newErrors.phone = "Ingresa un número válido";
    if (!form.email.trim()) newErrors.email = "El correo es requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Ingresa un correo válido";
    if (!form.address.trim()) newErrors.address = "La dirección es requerida";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setUser(form);
    setSubmitted(true);
    setTimeout(() => {
      if (restaurantId) navigate(`/chat/${restaurantId}`);
      else navigate("/");
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-10 text-center shadow-lg max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-gray-900 mb-2" style={{ fontWeight: 700 }}>¡Registro exitoso!</h2>
          <p className="text-gray-500" style={{ fontSize: "0.9rem" }}>
            Bienvenido, {form.name.split(" ")[0]}. Redirigiendo al chatbot...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-amber-400 p-6 text-white">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            style={{ fontSize: "0.85rem" }}
          >
            <ArrowLeft size={16} />
            Volver
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <UtensilsCrossed size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white" style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                Crear cuenta
              </h1>
              <p className="text-white/80" style={{ fontSize: "0.85rem" }}>
                {restaurantId ? "Para continuar con tu pedido" : "Únete a FoodBot"}
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="text-gray-700 mb-1 flex items-center gap-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              <User size={15} className="text-amber-400" />
              Nombre completo
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ej: María García"
              className={`w-full border rounded-xl px-4 py-2.5 outline-none transition-all bg-gray-50 focus:bg-white ${
                errors.name ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
              }`}
              style={{ fontSize: "0.9rem" }}
            />
            {errors.name && (
              <p className="text-red-500 mt-1" style={{ fontSize: "0.78rem" }}>{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-gray-700 mb-1 flex items-center gap-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              <Phone size={15} className="text-amber-400" />
              Número de teléfono
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="Ej: 3001234567"
              className={`w-full border rounded-xl px-4 py-2.5 outline-none transition-all bg-gray-50 focus:bg-white ${
                errors.phone ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
              }`}
              style={{ fontSize: "0.9rem" }}
            />
            {errors.phone && (
              <p className="text-red-500 mt-1" style={{ fontSize: "0.78rem" }}>{errors.phone}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-gray-700 mb-1 flex items-center gap-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              <Mail size={15} className="text-amber-400" />
              Correo electrónico
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Ej: maria@correo.com"
              className={`w-full border rounded-xl px-4 py-2.5 outline-none transition-all bg-gray-50 focus:bg-white ${
                errors.email ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
              }`}
              style={{ fontSize: "0.9rem" }}
            />
            {errors.email && (
              <p className="text-red-500 mt-1" style={{ fontSize: "0.78rem" }}>{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="text-gray-700 mb-1 flex items-center gap-2" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
              <MapPin size={15} className="text-amber-400" />
              Dirección de entrega
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Ej: Calle 5 #4-32, Apto 101"
              className={`w-full border rounded-xl px-4 py-2.5 outline-none transition-all bg-gray-50 focus:bg-white ${
                errors.address ? "border-red-400 focus:border-red-400" : "border-gray-200 focus:border-amber-400"
              }`}
              style={{ fontSize: "0.9rem" }}
            />
            {errors.address && (
              <p className="text-red-500 mt-1" style={{ fontSize: "0.78rem" }}>{errors.address}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-white rounded-xl py-3 transition-colors"
            style={{ fontWeight: 700, fontSize: "1rem" }}
          >
            {user ? "Actualizar datos" : "Crear cuenta y continuar"} →
          </button>

          {user && (
            <button
              type="button"
              onClick={() => {
                if (restaurantId) navigate(`/chat/${restaurantId}`);
                else navigate("/");
              }}
              className="w-full text-gray-500 hover:text-gray-700 py-2 transition-colors"
              style={{ fontSize: "0.85rem" }}
            >
              Continuar sin cambios
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
