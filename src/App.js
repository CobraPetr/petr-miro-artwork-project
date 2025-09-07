import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "./components/Layout";
import ArtworkPage from "./components/ArtworkPage";
import { ArtworkProvider } from "./context/ArtworkContextDB";
import { LanguageProvider } from "./context/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import './index.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <LanguageProvider>
            <ArtworkProvider>
              <Routes>
                <Route path="/" element={<Layout />} />
                <Route path="/artwork/:id" element={<ArtworkPage />} />
                <Route path="*" element={<Layout />} />
              </Routes>
            </ArtworkProvider>
          </LanguageProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;