/// <reference types="vite/client" />
// src/global.d.ts
declare namespace NodeJS {
    interface ProcessEnv {
    BACKEND_URL: string; // Add other environment variables as needed
      // Add more environment variables here
    }
  }

  