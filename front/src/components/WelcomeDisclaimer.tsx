/**
 * Welcome Disclaimer Dialog Component
 *
 * IMPORTANT DISCLAIMER:
 * - All UFO sighting data belongs exclusively to the National UFO Reporting Center (NUFORC)
 * - This web application is for EDUCATIONAL and PERSONAL USE ONLY
 * - NO commercial use or income generation intended
 *
 * Created for learning purposes only.
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function WelcomeDisclaimer() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if user has already seen the disclaimer
    const hasSeenDisclaimer = localStorage.getItem("ufo-disclaimer-seen");
    if (!hasSeenDisclaimer) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("ufo-disclaimer-seen", "true");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Important Notice
          </DialogTitle>
          <DialogDescription className="text-base space-y-4 pt-4">
            <div className="space-y-3">
              <p className="font-semibold text-foreground">
                Educational Project - Non-Commercial Use
              </p>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <strong>Data Ownership:</strong> All UFO sighting data
                  displayed on this website belongs exclusively to the{" "}
                  <a
                    href="https://nuforc.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    National UFO Reporting Center (NUFORC)
                  </a>
                  .
                </p>

                <p className="text-sm">
                  <strong>Purpose:</strong> This website is built strictly for
                  personal learning, experimentation, and educational purposes.
                  I collect the data myself for educational purposes only.
                </p>

                <p className="text-sm">
                  <strong>No Commercial Use:</strong> There is no commercial
                  intent, monetization, or income generation associated with
                  this project.
                </p>
              </div>

              <p className="text-xs text-muted-foreground">
                By continuing to use this website, you acknowledge that this is
                an educational project and that all data rights belong to
                NUFORC.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 pt-4">
          <Button onClick={handleAccept} className="w-full sm:w-auto">
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
