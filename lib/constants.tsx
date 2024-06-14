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
import { PrivateRoute, PublicRoute } from "./routes";

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
    title: PublicRoute.HOME.title,
    name: PublicRoute.HOME.title,
    path: PublicRoute.HOME.path,
    href: PublicRoute.HOME.href,
    icon: <Home className="w-6 h-6" />,
  },
  {
    title: PublicRoute.US.title,
    name: PublicRoute.US.title,
    path: PublicRoute.US.path,
    href: PublicRoute.US.href,
    icon: <Building2 className="w-6 h-6" />,
  },
  {
    title: PublicRoute.CONTACT.title,
    name: PublicRoute.CONTACT.title,
    path: PublicRoute.CONTACT.path,
    href: PublicRoute.CONTACT.href,
    icon: <Phone className="w-6 h-6" />,
  },
];

export const MenuFooterItems = [
  {
    title: PublicRoute.COOKIES.title,
    name: PublicRoute.COOKIES.title,
    path: PublicRoute.COOKIES.path,
    href: PublicRoute.COOKIES.href,
    icon: <Cookie className="w-6 h-6" />,
  },
  {
    title: PublicRoute.POLICY.title,
    name: PublicRoute.POLICY.title,
    path: PublicRoute.POLICY.path,
    href: PublicRoute.POLICY.href,
    icon: <ShieldCheck className="w-6 h-6" />,
  },
  {
    title: PublicRoute.TERMS.title,
    name: PublicRoute.TERMS.title,
    path: PublicRoute.TERMS.path,
    href: PublicRoute.TERMS.href,
    icon: <ScrollText className="w-6 h-6" />,
  },
];
