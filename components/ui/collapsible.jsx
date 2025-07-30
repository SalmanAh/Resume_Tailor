import React, { useState, cloneElement } from "react";

export function Collapsible({ children, open, onOpenChange }) {
  const [isOpen, setIsOpen] = useState(open || false);
  
  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onOpenChange) {
      onOpenChange(newState);
    }
  };

  // Find trigger and content
  let trigger = null;
  let content = null;
  const rest = [];
  
  React.Children.forEach(children, child => {
    if (child && child.type && child.type.displayName === "CollapsibleTrigger") {
      trigger = cloneElement(child, { onClick: handleToggle });
    } else if (child && child.type && child.type.displayName === "CollapsibleContent") {
      content = (open !== undefined ? open : isOpen) ? child : null;
    } else {
      rest.push(child);
    }
  });

  return (
    <div className="relative">
      {trigger}
      {content}
      {rest}
    </div>
  );
}

function CollapsibleTrigger({ asChild, children, onClick }) {
  if (asChild) {
    return React.cloneElement(children, { onClick });
  }
  return <button onClick={onClick}>{children}</button>;
}
CollapsibleTrigger.displayName = "CollapsibleTrigger";
export { CollapsibleTrigger };

function CollapsibleContent({ children, className = "" }) {
  return (
    <div className={`transition-all duration-200 ease-in-out ${className}`}>
      {children}
    </div>
  );
}
CollapsibleContent.displayName = "CollapsibleContent";
export { CollapsibleContent }; 