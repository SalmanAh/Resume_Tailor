"use client"
import Form from "@/components/Form";

// This page provides a dedicated, standalone route for the login/signup form.
export default function LoginPage() {
  return (
    <div className="login-page min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4" style={{ backgroundImage: 'url(/bg.png)' }}>
      <Form />
    </div>
  );
} 