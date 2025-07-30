"use client";
// This is the home page, not the dashboard. The dashboard is at /dashboard.
import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import WebsiteIntro from '../../components/WebsiteIntro';

export default function Home() {
  useEffect(() => {
    // Debug: Log when the main page loads
    // console.log('Main page loaded');
    
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const type = params.get("type");
      if (access_token && refresh_token && type === "magiclink") {
        supabase.auth.setSession({
          access_token,
          refresh_token,
        }).then(async () => {
          // Poll for session
          let tries = 0;
          let user = null;
          while (tries < 10) {
            const { data } = await supabase.auth.getUser();
            user = data.user;
            if (user) break;
            await new Promise(res => setTimeout(res, 200)); // wait 200ms
            tries++;
          }
          if (user) {
            window.location.replace("/dashboard");
          } else {
            window.location.replace("/login");
            // console.log(user);
          }
        });
      }
    }
  }, []);
  return <WebsiteIntro />;
}