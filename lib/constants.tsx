import {
  BadgeDollarSign,
  Building2,
  Cookie,
  Home,
  LayoutDashboard,
  Phone,
  ScrollText,
  Settings,
  ShieldCheck,
  ShoppingBasket,
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
    title: PrivateRoute.CONSULTINGS.title,
    name: PrivateRoute.CONSULTINGS.title,
    path: PrivateRoute.CONSULTINGS.path,
    href: PrivateRoute.CONSULTINGS.href,
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

export const MenuItems = [
  {
    title: PrivateRoute.HOME.title,
    name: PrivateRoute.HOME.title,
    path: PrivateRoute.HOME.path,
    href: PrivateRoute.HOME.href,
    icon: <Home className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.US.title,
    name: PrivateRoute.US.title,
    path: PrivateRoute.US.path,
    href: PrivateRoute.US.href,
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.CONTACT.title,
    name: PrivateRoute.CONTACT.title,
    path: PrivateRoute.CONTACT.path,
    href: PrivateRoute.CONTACT.href,
    icon: <Phone className="w-6 h-6" />,
  },
];

export const MenuFooterItems = [
  {
    title: PrivateRoute.COOKIES.title,
    name: PrivateRoute.COOKIES.title,
    path: PrivateRoute.COOKIES.path,
    href: PrivateRoute.COOKIES.href,
    icon: <Cookie className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.POLICY.title,
    name: PrivateRoute.POLICY.title,
    path: PrivateRoute.POLICY.path,
    href: PrivateRoute.POLICY.href,
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: PrivateRoute.TERMS.title,
    name: PrivateRoute.TERMS.title,
    path: PrivateRoute.TERMS.path,
    href: PrivateRoute.TERMS.href,
    icon: <ScrollText className="w-6 h-6" />,
  },
];
