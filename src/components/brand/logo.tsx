"use client";

import Image from "next/image";
import { useState } from "react";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 180, height = 60 }: LogoProps) {
  const [imgError, setImgError] = useState(false);

  if (imgError) {
    return (
      <span
        className={`inline-flex items-center text-2xl font-bold text-msp-primary ${className}`}
        style={{ width, height }}
      >
        MSP<span className="text-msp-blue">+</span>
      </span>
    );
  }

  return (
    <Image
      src="/logo.png"
      alt="MSP+"
      width={width}
      height={height}
      className={className}
      priority
      onError={() => setImgError(true)}
    />
  );
}
