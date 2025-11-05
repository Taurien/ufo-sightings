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
import { Button } from "@/components/ui/button";

export default function MapDrawer() {
  return (
    <Drawer>
      <DrawerTrigger className=" absolute bottom-13 md:bottom-10 left-1/2 w-6 h-6 flex items-center justify-center bg-white rounded-full z-30">
        <ChevronUp className=" aspect-square w-5" />
      </DrawerTrigger>
      <DrawerContent className=" z-30">
        <DrawerHeader>
          <DrawerTitle>Map types</DrawerTitle>
          <DrawerDescription>Choose your preferred map style</DrawerDescription>
        </DrawerHeader>
        <div className=" grid grid-flow-col p-4 gap-2">
          <Button className="w-full mb-2">Standard Map</Button>
          <Button className="w-full mb-2">Heat Map</Button>
        </div>
        {/* <DrawerFooter>
          <div>Submit</div>
          <DrawerClose>
            <div>Cancel</div>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}
