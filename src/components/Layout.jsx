import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ArtworksList } from "./ArtworksList";
import { WarehouseView } from "./WarehouseView";
import { Settings } from "./Settings";
import { ArtworkDetailsModal } from "./ArtworkDetailsModal";
import QRScanner from "./QRScanner";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "framer-motion";

export const Layout = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("warehouses");
  const [showQRScanner, setShowQRScanner] = useState(false);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-background overflow-x-hidden"
    >
      {/* Glassy header section */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-6">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
              {t('header.title')}
            </h1>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg font-normal tracking-wide">
              {t('header.subtitle')}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-6 h-10 sm:h-12 p-1 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-lg">
            <TabsTrigger 
              value="warehouses" 
              className="text-sm sm:text-base font-medium rounded-lg data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600"
            >
              {t('nav.warehouses')}
            </TabsTrigger>
            <TabsTrigger 
              value="artworks" 
              className="text-sm sm:text-base font-medium rounded-lg data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600"
            >
              {t('nav.artworks')}
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="text-sm sm:text-base font-medium rounded-lg data-[state=active]:bg-white/80 data-[state=active]:shadow-lg data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600"
            >
              {t('nav.settings')}
            </TabsTrigger>
          </TabsList>
        
          <TabsContent value="warehouses" className="mt-0">
            <WarehouseView key={activeTab} />
          </TabsContent>
          
          <TabsContent value="artworks" className="mt-0">
            <ArtworksList key={activeTab} />
          </TabsContent>
          
          <TabsContent value="settings" className="mt-0">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
      
      <ArtworkDetailsModal />
      
      {showQRScanner && (
        <QRScanner
          onScan={(data) => {
            console.log('QR Code scanned:', data);
            setShowQRScanner(false);
            // You can add logic here to handle the scanned data
          }}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </motion.div>
  );
};