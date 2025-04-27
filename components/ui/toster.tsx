"use client";

import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";

const TosterBaseOnDevice = () => {
  const [toasterPosition, setToasterPosition] = useState<
    "bottom-right" | "top-center"
  >("bottom-right");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setToasterPosition("top-center");
      } else {
        setToasterPosition("bottom-right");
      }
    };

    // Set initial position
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Toaster position={toasterPosition} closeButton expand={true} richColors />
  );
};

export default TosterBaseOnDevice;
