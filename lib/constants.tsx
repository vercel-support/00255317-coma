import {
  LayoutDashboard,
  Shapes,
  ShoppingBag,
  Tag,
  UsersRound,
} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  },
  {
    url: "/categories",
    icon: <Shapes />,
    label: "Categorías",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Productos",
  },
  {
    url: "/orders",
    icon: <ShoppingBag />,
    label: "Pedidos",
  },
  {
    url: "/customers",
    icon: <UsersRound />,
    label: "Clientes",
  },
];
