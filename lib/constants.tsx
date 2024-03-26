import {
  BadgeDollarSign,
  LayoutDashboard,
  Monitor,
  Settings,
  ShoppingBasket,
  Truck,
  Warehouse,
} from "lucide-react";
import { PiUsersThreeBold } from "react-icons/pi";
import { PrivateRoute } from "./routes";

export const MenuItemsAdmin = [
  {
    title: PrivateRoute.DASHBOARD.title,
    name: PrivateRoute.DASHBOARD.title,
    path: PrivateRoute.DASHBOARD.path,
    href: PrivateRoute.DASHBOARD.href,
    icon: <LayoutDashboard className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.TPV.title,
    name: PrivateRoute.TPV.title,
    path: PrivateRoute.TPV.path,
    href: PrivateRoute.TPV.href,
    icon: <Monitor className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.SUPPLIERS.title,
    name: PrivateRoute.SUPPLIERS.title,
    path: PrivateRoute.SUPPLIERS.path,
    href: PrivateRoute.SUPPLIERS.href,
    icon: <Truck className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.WAREHOUSES.title,
    name: PrivateRoute.WAREHOUSES.title,
    path: PrivateRoute.WAREHOUSES.path,
    href: PrivateRoute.WAREHOUSES.href,
    icon: <Warehouse className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.PRODUCTS.title,
    name: PrivateRoute.PRODUCTS.title,
    path: PrivateRoute.PRODUCTS.path,
    href: PrivateRoute.PRODUCTS.href,
    icon: <ShoppingBasket className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.CASH_MANAGEMENT.title,
    name: PrivateRoute.CASH_MANAGEMENT.title,
    path: PrivateRoute.CASH_MANAGEMENT.path,
    href: PrivateRoute.CASH_MANAGEMENT.href,
    icon: <BadgeDollarSign className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.USERS.title,
    name: PrivateRoute.USERS.title,
    path: PrivateRoute.USERS.path,
    href: PrivateRoute.USERS.href,
    icon: <PiUsersThreeBold className="w-6 h-6" />,
  },

  {
    title: PrivateRoute.SETTINGS.title,
    name: PrivateRoute.SETTINGS.title,
    path: PrivateRoute.SETTINGS.path,
    href: PrivateRoute.SETTINGS.href,
    icon: <Settings className="w-6 h-6" />,
  },
];
