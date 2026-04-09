export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  category: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  emoji: string;
}

export interface Restaurant {
  id: string;
  name: string;
  tagline: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  color: string;
  accentColor: string;
  categories: MenuCategory[];
  menu: MenuItem[];
}

export const restaurants: Restaurant[] = [
  {
    id: "nico-express",
    name: "Nico Express",
    tagline: "Sabor colombiano en cada bocado",
    cuisine: "Comida Colombiana",
    rating: 4.8,
    deliveryTime: "20-30 min",
    deliveryFee: 3000,
    image: "https://images.unsplash.com/photo-1723552923181-0b0dd478850f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvbWJpYW4lMjBmYXN0JTIwZm9vZCUyMHJlc3RhdXJhbnR8ZW58MXx8fHwxNzcyMTE1NDYzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#F59E0B",
    accentColor: "#FEF3C7",
    categories: [
      { id: "platos", name: "Platos Principales", emoji: "🍽️" },
      { id: "porciones", name: "Porciones & Ensaladas", emoji: "🥗" },
      { id: "bebidas", name: "Bebidas", emoji: "🥤" },
    ],
    menu: [
      { id: "ne1", name: "Bandeja Paisa", description: "Frijoles, arroz, chicharrón, huevo, carne, chorizo y aguacate", price: 28000, emoji: "🍛", category: "platos" },
      { id: "ne2", name: "Ajiaco Santafereño", description: "Sopa tradicional con papa, pollo, mazorca y crema", price: 22000, emoji: "🍲", category: "platos" },
      { id: "ne3", name: "Chuleta Valluna", description: "Chuleta empanizada con papas fritas y ensalada", price: 25000, emoji: "🥩", category: "platos" },
      { id: "ne4", name: "Arroz con Pollo", description: "Arroz especiado con pollo y vegetales", price: 20000, emoji: "🍗", category: "platos" },
      { id: "ne5", name: "Porción de Empanadas (3)", description: "Empanadas criollas con ají de maní", price: 9000, emoji: "🥟", category: "porciones" },
      { id: "ne6", name: "Patacones con Hogao", description: "Patacones fritos con hogao casero", price: 8000, emoji: "🫓", category: "porciones" },
      { id: "ne7", name: "Ensalada Verde", description: "Lechuga, tomate, pepino, zanahoria y aderezo", price: 7000, emoji: "🥗", category: "porciones" },
      { id: "ne8", name: "Limonada de Coco", description: "Refrescante limonada con leche de coco", price: 7000, emoji: "🥥", category: "bebidas" },
      { id: "ne9", name: "Jugo Natural", description: "Maracuyá, mora, mango o lulo", price: 6000, emoji: "🧃", category: "bebidas" },
      { id: "ne10", name: "Gaseosa", description: "Coca-Cola, Pepsi o agua", price: 4000, emoji: "🥤", category: "bebidas" },
    ],
  },
  {
    id: "la-italiana",
    name: "La Italiana",
    tagline: "Pizza & Pasta auténtica italiana",
    cuisine: "Comida Italiana",
    rating: 4.6,
    deliveryTime: "25-40 min",
    deliveryFee: 4000,
    image: "https://images.unsplash.com/photo-1692025690885-736a2cf8eae4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpdGFsaWFuJTIwcGl6emElMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MjA2MTEwOXww&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#EF4444",
    accentColor: "#FEE2E2",
    categories: [
      { id: "pizzas", name: "Pizzas", emoji: "🍕" },
      { id: "pastas", name: "Pastas", emoji: "🍝" },
      { id: "bebidas", name: "Bebidas", emoji: "🥤" },
    ],
    menu: [
      { id: "li1", name: "Pizza Margarita", description: "Salsa de tomate, mozzarella y albahaca fresca", price: 32000, emoji: "🍕", category: "pizzas" },
      { id: "li2", name: "Pizza Pepperoni", description: "Salsa de tomate, mozzarella y pepperoni", price: 36000, emoji: "🍕", category: "pizzas" },
      { id: "li3", name: "Pizza 4 Quesos", description: "Mozzarella, gorgonzola, parmesano y brie", price: 38000, emoji: "🍕", category: "pizzas" },
      { id: "li4", name: "Pizza Hawaiana", description: "Jamón, piña y mozzarella", price: 34000, emoji: "🍕", category: "pizzas" },
      { id: "li5", name: "Spaghetti Bolognese", description: "Pasta con salsa de carne y tomate", price: 28000, emoji: "🍝", category: "pastas" },
      { id: "li6", name: "Fettuccine Alfredo", description: "Pasta en salsa cremosa con queso parmesano", price: 27000, emoji: "🍝", category: "pastas" },
      { id: "li7", name: "Penne Arrabbiata", description: "Pasta con salsa picante de tomate y ajo", price: 25000, emoji: "🍝", category: "pastas" },
      { id: "li8", name: "Agua Mineral", description: "Agua mineral con o sin gas", price: 5000, emoji: "💧", category: "bebidas" },
      { id: "li9", name: "Vino de la Casa", description: "Copa de vino tinto o blanco", price: 15000, emoji: "🍷", category: "bebidas" },
      { id: "li10", name: "Gaseosa", description: "Coca-Cola, Sprite o agua", price: 4000, emoji: "🥤", category: "bebidas" },
    ],
  },
  {
    id: "sushi-tokyo",
    name: "Sushi Tokyo",
    tagline: "Auténtica cocina japonesa",
    cuisine: "Comida Japonesa",
    rating: 4.9,
    deliveryTime: "30-45 min",
    deliveryFee: 5000,
    image: "https://images.unsplash.com/photo-1725122194872-ace87e5a1a8d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbmVzZSUyMHN1c2hpJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzE5OTgyNzB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#8B5CF6",
    accentColor: "#EDE9FE",
    categories: [
      { id: "rolls", name: "Rolls & Makis", emoji: "🍣" },
      { id: "ramen", name: "Ramen & Sopas", emoji: "🍜" },
      { id: "bebidas", name: "Bebidas", emoji: "🥤" },
    ],
    menu: [
      { id: "st1", name: "California Roll (8 pzas)", description: "Cangrejo, aguacate y pepino con semillas de sésamo", price: 28000, emoji: "🍣", category: "rolls" },
      { id: "st2", name: "Spicy Tuna Roll (8 pzas)", description: "Atún spicy, pepino y tobiko", price: 32000, emoji: "🍣", category: "rolls" },
      { id: "st3", name: "Dragon Roll (8 pzas)", description: "Camarón tempura, aguacate y anguila", price: 38000, emoji: "🍣", category: "rolls" },
      { id: "st4", name: "Rainbow Roll (8 pzas)", description: "Variedad de pescados frescos sobre california roll", price: 42000, emoji: "🌈", category: "rolls" },
      { id: "st5", name: "Ramen Tonkotsu", description: "Caldo de cerdo con fideos, huevo y chashu", price: 35000, emoji: "🍜", category: "ramen" },
      { id: "st6", name: "Miso Ramen", description: "Caldo de miso con tofu, champiñones y verduras", price: 30000, emoji: "🍜", category: "ramen" },
      { id: "st7", name: "Udon de Pollo", description: "Fideos udon gruesos con pollo y caldo dashi", price: 28000, emoji: "🍜", category: "ramen" },
      { id: "st8", name: "Té Verde", description: "Té verde japonés caliente o frío", price: 6000, emoji: "🍵", category: "bebidas" },
      { id: "st9", name: "Sake", description: "Sake caliente o frío (50ml)", price: 18000, emoji: "🍶", category: "bebidas" },
      { id: "st10", name: "Ramune", description: "Refresco japonés de frutas", price: 8000, emoji: "🥤", category: "bebidas" },
    ],
  },
  {
    id: "el-mexicano",
    name: "El Mexicano",
    tagline: "Tacos, burritos y mucho sabor",
    cuisine: "Comida Mexicana",
    rating: 4.7,
    deliveryTime: "20-35 min",
    deliveryFee: 3500,
    image: "https://images.unsplash.com/photo-1666307551772-943e4b88d564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwdGFjb3MlMjBmb29kJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NzIxMTU0NjR8MA&ixlib=rb-4.1.0&q=80&w=1080",
    color: "#10B981",
    accentColor: "#D1FAE5",
    categories: [
      { id: "tacos", name: "Tacos & Burritos", emoji: "🌮" },
      { id: "extras", name: "Extras & Salsas", emoji: "🫙" },
      { id: "bebidas", name: "Bebidas", emoji: "🥤" },
    ],
    menu: [
      { id: "em1", name: "Tacos al Pastor (3)", description: "Carne de cerdo marinada, piña, cebolla y cilantro", price: 18000, emoji: "🌮", category: "tacos" },
      { id: "em2", name: "Tacos de Pollo (3)", description: "Pollo asado, guacamole y pico de gallo", price: 16000, emoji: "🌮", category: "tacos" },
      { id: "em3", name: "Burrito Clásico", description: "Arroz, frijoles, carne, guacamole y queso", price: 24000, emoji: "🌯", category: "tacos" },
      { id: "em4", name: "Quesadilla de Res", description: "Tortilla con carne, queso fundido y jalapeños", price: 20000, emoji: "🫓", category: "tacos" },
      { id: "em5", name: "Nachos con Guacamole", description: "Totopos crujientes con guacamole casero", price: 14000, emoji: "🧀", category: "extras" },
      { id: "em6", name: "Salsas (3 variedades)", description: "Verde, roja y habanero", price: 5000, emoji: "🫙", category: "extras" },
      { id: "em7", name: "Elotes con Crema", description: "Mazorca con crema, queso y chile", price: 8000, emoji: "🌽", category: "extras" },
      { id: "em8", name: "Horchata", description: "Bebida de arroz con canela y vainilla", price: 7000, emoji: "🥛", category: "bebidas" },
      { id: "em9", name: "Margarita sin Alcohol", description: "Limón, sal y jengibre", price: 10000, emoji: "🍹", category: "bebidas" },
      { id: "em10", name: "Agua de Jamaica", description: "Refrescante agua de flor de Jamaica", price: 6000, emoji: "🌺", category: "bebidas" },
    ],
  },
];

export function getRestaurantById(id: string): Restaurant | undefined {
  return restaurants.find((r) => r.id === id);
}
