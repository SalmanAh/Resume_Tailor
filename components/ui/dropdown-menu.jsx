import React, { useState, cloneElement } from "react";

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  // Find trigger and content
  let trigger = null;
  let content = null;
  const rest = [];
  React.Children.forEach(children, child => {
    if (child && child.type && child.type.displayName === "DropdownMenuTrigger") {
      trigger = cloneElement(child, { onClick: () => setOpen(o => !o) });
    } else if (child && child.type && child.type.displayName === "DropdownMenuContent") {
      content = open ? child : null;
    } else {
      rest.push(child);
    }
  });
  return <div className="relative inline-block">{trigger}{content}{rest}</div>;
}

function DropdownMenuTrigger({ asChild, children, onClick }) {
  if (asChild) {
    return React.cloneElement(children, { onClick });
  }
  return <button onClick={onClick}>{children}</button>;
}
DropdownMenuTrigger.displayName = "DropdownMenuTrigger";
export { DropdownMenuTrigger };

function DropdownMenuContent({ align = "end", className = "", children }) {
  return (
    <div className={`absolute z-10 mt-2 min-w-[8rem] rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${className}`} style={{ right: align === "end" ? 0 : "auto" }}>
      {children}
    </div>
  );
}
DropdownMenuContent.displayName = "DropdownMenuContent";
export { DropdownMenuContent };

export function DropdownMenuItem({ children, className = "", onSelect, ...props }) {
  return (
    <div
      className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${className}`}
      onClick={onSelect}
      {...props}
    >
      {children}
    </div>
  );
} 