"use client";

import {
  changeStatusReadNotificationById,
  deleteAllNotifications,
} from "@/actions/notification.action";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getNotifications,
  getTotalNotifications as gtn,
} from "@/data/notifications.data";
import { TNotification } from "@/schemas";
import { NotificationType } from "@prisma/client";
import { AlertOctagon, AlertTriangle, Bell, BellDot, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { GiPayMoney } from "react-icons/gi";
import NProgress from "nprogress";
import { FcNext, FcPrevious } from "react-icons/fc";
import { cn } from "@/lib/utils";

export const ITEMS_PER_PAGE_NOTIFICATIONS = 5;

export const Notifications = () => {
  const [notifications, setNotifications] = useState<TNotification[]>([]);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { error, data } = await getNotifications(
          page * ITEMS_PER_PAGE_NOTIFICATIONS
        );
        if (error) {
          console.error("[BUTTON NOTIFICATION NAVBAR]", error);
          return;
        }
        setNotifications(data!);
        const totalNotifications = await getTotalNotifications();
        setTotalPages(
          Math.ceil(totalNotifications! / ITEMS_PER_PAGE_NOTIFICATIONS)
        );
      } catch (error) {
        console.log("[BUTTON NOTIFICATION NAVBAR]", error);
      }
    };
    fetchNotifications();
  }, [page]);

  const getTotalNotifications = async () => {
    try {
      const { data } = await gtn();
      return data;
    } catch (error) {
      console.error("[GET_TOTAL_NOTIFICATIONS]", error);
      return 0;
    }
  };

  const handleNotification = async (notification: TNotification) => {
    try {
      NProgress.start();
      const { error, data } = await changeStatusReadNotificationById(
        notification.id
      );
      if (error) {
        console.error("[BUTTON NOTIFICATION NAVBAR]", error);
        return;
      }

      router.push(notification.link);
    } catch (error) {
      console.log("[BUTTON NOTIFICATION NAVBAR]", error);
    } finally {
      NProgress.done();
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const deleteNotifications = () => async () => {
    try {
      const { error } = await deleteAllNotifications();
      if (error) {
        console.error("[DELETE_ALL_NOTIFICATIONS]", error);
        return;
      }
      setNotifications([]);
      setTotalPages(0);
    } catch (error) {
      console.error("[DELETE_ALL_NOTIFICATIONS]", error);
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {notifications.length && notifications.some((n) => !n.read) ? (
            <BellDot className="h-[1.2rem] w-[1.2rem]  transition-all dark:rotate-0 dark:scale-100" />
          ) : (
            <Bell className="h-[1.2rem] w-[1.2rem]   transition-all dark:rotate-0 dark:scale-100" />
          )}
          <span className="sr-only">Notificaciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background space-y-4 p-3 max-h-[90vh] overflow-y-auto"
      >
        {notifications.length ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className={cn(
                "p-4  cursor-pointer rounded-md transition-all ease-in-out duration-200",
                notification.read
                  ? "bg-background hover:bg-background/80 "
                  : "dark:bg-primary-foreground bg-slate-200  hover:bg-slate-200/80 dark:hover:bg-primary-foreground/80"
              )}
              onClick={() => {
                handleNotification(notification);
              }}
            >
              <div className="w-full flex items-center justify-start gap-4">
                {notification.type === NotificationType.INFO && (
                  <Info color="#1c71d8" />
                )}
                {notification.type === NotificationType.WARNING && (
                  <AlertTriangle color="#f6d32d" />
                )}
                {notification.type === NotificationType.LOW_STOCK_ALERT && (
                  <AlertOctagon color="#e01b24" />
                )}
                {notification.type ===
                  NotificationType.PAYMENT_NOTIFICATION && (
                  <GiPayMoney color="#e01b24" className="h-6 w-6" />
                )}

                <div className="flex flex-col gap-y-2">
                  <span className="text-sm">{notification.title}</span>
                  <span className="w-[200px] text-wrap text-xs text-gray-500">
                    {notification.message}
                  </span>
                </div>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>
            <span className="text-sm">No hay notificationes</span>
          </DropdownMenuItem>
        )}
        <div className="flex justify-between items-center">
          <DropdownMenuItem onClick={handlePreviousPage} disabled={page === 0}>
            <FcPrevious className="h-6 w-6" />
          </DropdownMenuItem>
          <div className="text-sm text-gray-500">
            Página {page + 1} de {totalPages}
          </div>{" "}
          <DropdownMenuItem onClick={handleNextPage}>
            <FcNext className="h-6 w-6" />
          </DropdownMenuItem>
        </div>
        <Button variant="ghost" size="sm" onClick={deleteNotifications()}>
          Eliminar todas las notificaciones
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
