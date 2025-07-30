"use client"

import { useEffect } from 'react'

export default function DebugLayout() {
  useEffect(() => {
    // Debug: Log layout information
      // console.log('DebugLayout: Page loaded');
  // console.log('DebugLayout: Window dimensions:', window.innerWidth, 'x', window.innerHeight);
  // console.log('DebugLayout: Document body dimensions:', document.body.offsetWidth, 'x', document.body.offsetHeight);
    
    // Check for any CSS that might be affecting the layout
    const bodyStyles = window.getComputedStyle(document.body);
    // console.log('DebugLayout: Body overflow:', bodyStyles.overflow);
    // console.log('DebugLayout: Body margin:', bodyStyles.margin);
    // console.log('DebugLayout: Body padding:', bodyStyles.padding);
    
    // Check for any global CSS resets
    const htmlStyles = window.getComputedStyle(document.documentElement);
    // console.log('DebugLayout: HTML overflow:', htmlStyles.overflow);
    // console.log('DebugLayout: HTML margin:', htmlStyles.margin);
    // console.log('DebugLayout: HTML padding:', htmlStyles.padding);
  }, []);

  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white p-2 rounded text-xs z-50">
      Debug: Layout Active
    </div>
  );
} 