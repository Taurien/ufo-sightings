import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      {/* <div  className="absolute @z-10000 w-full h-full flex items-center justify-center  bg-white/50"> */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* <DialogTrigger>Open</DialogTrigger> */}
        <DialogContent className="z-1001">
          <DialogHeader>
            <DialogTitle>title</DialogTitle>
            <DialogDescription>
              <button onClick={() => setIsOpen(false)}>see map</button>
              <a href="/data">see data and other stats</a>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      {/* </div> */}
    </>
  );
}
