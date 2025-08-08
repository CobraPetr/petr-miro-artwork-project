import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArtworksList } from "./ArtworksList";
import { WarehouseView } from "./WarehouseView";
import { ArtworkDetailsModal } from "./ArtworkDetailsModal";
import { motion } from "framer-motion";

export const Layout = () => {
  const [activeTab, setActiveTab] = useState("warehouses");
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background"
    >
      {/* iOS-style header section */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-foreground mb-1">Kunstwerk-Organizer</h1>
            <p className="text-muted-foreground text-base">
              Verwalten Sie Ihre Kunstsammlung
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8 h-12 p-1 bg-muted rounded-xl">
            <TabsTrigger 
              value="warehouses" 
              className="text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-ios data-[state=active]:text-foreground"
            >
              Lagerhäuser
            </TabsTrigger>
            <TabsTrigger 
              value="artworks" 
              className="text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-ios data-[state=active]:text-foreground"
            >
              Alle Kunstwerke
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="warehouses" className="mt-0">
            <WarehouseView />
          </TabsContent>
          
          <TabsContent value="artworks" className="mt-0">
            <ArtworksList />
          </TabsContent>
        </Tabs>
      </div>
      
      <ArtworkDetailsModal />
    </motion.div>
  );
};