"use client";
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Edit, Plus } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
interface Props {
  children: React.ReactNode;
  buttonText: string;
  title: string;
  description: string;
  setOpen: (value: boolean) => void;
  open: boolean;
  edit?: boolean;
}
const ContainerFormDrawer = ({
  children,
  buttonText,
  title,
  description,
  setOpen,
  open,
  edit = false,
}: Props) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        {edit ? (
          <Button className="max-xs:p-1 max-xs:text-xs">
            <Edit className="mr-2 h-4 w-4" />
          </Button>
        ) : (
          <Button className="max-xs:p-1 max-xs:text-xs">
            <Plus className="mr-2 h-4 w-4" />
            {buttonText}
          </Button>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader className="justify-center">
            <DrawerTitle className="text-2xl font-bold">{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </DrawerHeader>
          <Separator className="w-3/4 mx-auto" />
          <ScrollArea className="h-[60vh] w-full px-2">
            {children}
            <DrawerFooter>
              <DrawerClose>
                <Button variant="outline" className="w-full">
                  Cancelar
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ContainerFormDrawer;
