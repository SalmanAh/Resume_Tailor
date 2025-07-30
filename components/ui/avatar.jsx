import React from "react";

export function Avatar({ className = "", children }) {
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-bold ${className}`} style={{ width: 32, height: 32, fontSize: 16 }}>
      {children}
    </span>
  );
}

export function AvatarFallback({ children, className = "" }) {
  return (
    <span className={className}>{children}</span>
  );
} 