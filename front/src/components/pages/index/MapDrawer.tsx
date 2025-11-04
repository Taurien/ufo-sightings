import { ChevronUp } from "lucide-react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export default function MapDrawer() {
  return (
    <Drawer>
      <DrawerTrigger className=" absolute bottom-2 left-1/2 w-6 h-6 flex items-center justify-center bg-white rounded-full z-1000">
        <ChevronUp className=" aspect-square w-5" />
      </DrawerTrigger>
      <DrawerContent className=" z-1000">
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>This action cannot be undone.</DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <div>Submit</div>
          <DrawerClose>
            <div>Cancel</div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
