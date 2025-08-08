import React, { useState, useEffect, useCallback } from "react";
import { useArtwork } from "../context/ArtworkContextDB";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Box, Warehouse, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";

export const WarehouseView = () => {
  const { getArtworksAtLocation } = useArtwork();
  const [currentView, setCurrentView] = useState({
    warehouse: null,
    floor: null,
    shelf: null,
    box: null,
    folder: null
  });
  const [viewArtworks, setViewArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate warehouses (1-4) based on our database structure
  const warehouses = [
    { id: "1", name: "Lagerhaus 1" },
    { id: "2", name: "Lagerhaus 2" }, 
    { id: "3", name: "Lagerhaus 3" },
    { id: "4", name: "Lagerhaus 4" }
  ];

  const loadArtworksForLocation = useCallback(async (warehouse, floor, shelf, box, folder) => {
    setLoading(true);
    try {
      const result = await getArtworksAtLocation(warehouse, floor, shelf, box, folder);
      setViewArtworks(result || []);
    } catch (error) {
      console.error('Error loading artworks:', error);
      setViewArtworks([]);
    } finally {
      setLoading(false);
    }
  }, [getArtworksAtLocation]);

  useEffect(() => {
    if (currentView.warehouse) {
      loadArtworksForLocation(
        currentView.warehouse,
        currentView.floor,
        currentView.shelf,
        currentView.box,
        currentView.folder
      );
    }
  }, [currentView, loadArtworksForLocation]);

  const handleLocationClick = (locationType, value) => {
    const newView = { ...currentView };
    
    switch(locationType) {
      case "warehouse":
        setCurrentView({ warehouse: value, floor: null, shelf: null, box: null, folder: null });
        break;
      case "floor":
        newView.floor = value;
        newView.shelf = null;
        newView.box = null;
        newView.folder = null;
        setCurrentView(newView);
        break;
      case "shelf":
        newView.shelf = value;
        newView.box = null;
        newView.folder = null;
        setCurrentView(newView);
        break;
      case "box":
        newView.box = value;
        newView.folder = null;
        setCurrentView(newView);
        break;
      case "folder":
        newView.folder = value;
        setCurrentView(newView);
        break;
      default:
        // Do nothing for unknown location types
        break;
    }
  };

  const navigateBack = () => {
    if (currentView.folder) {
      setCurrentView({ ...currentView, folder: null });
    } else if (currentView.box) {
      setCurrentView({ ...currentView, box: null });
    } else if (currentView.shelf) {
      setCurrentView({ ...currentView, shelf: null });
    } else if (currentView.floor) {
      setCurrentView({ ...currentView, floor: null });
    }
  };

  const renderLocationIcon = (locationType) => {
    switch(locationType) {
      case "warehouse": return <Warehouse size={18} />;
      case "floor": return <FolderOpen size={18} />;
      case "shelf": return <FolderOpen size={18} />;
      case "box": return <Box size={18} />;
      default: return <Box size={18} />;
    }
  };

  const renderLocationCard = (name, type, count, onClick) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="mb-4 cursor-pointer transition-all duration-200 border-border/50 hover:border-border hover:shadow-ios active:scale-[0.98] bg-card/50 backdrop-blur-sm"
          onClick={onClick}
        >
          <CardHeader className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {renderLocationIcon(type)}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">
                    {name}
                  </CardTitle>
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                {count}
              </Badge>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    );
  };

  const renderArtworks = () => {
    if (loading) {
      return <div className="text-center py-8">Loading artworks...</div>;
    }

    return (
      <div>
        <Button 
          variant="outline" 
          onClick={navigateBack} 
          className="mb-6 w-full sm:w-auto h-11 text-sm border-border/50 hover:bg-muted"
        >
          <ArrowLeft className="mr-2" size={16} /> Zurück
        </Button>
        
        <h2 className="section-header">KUNSTWERKE IN ORDNER {currentView.folder}</h2>
        {viewArtworks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Keine Kunstwerke in diesem Ordner gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {viewArtworks.map(artwork => (
              <Card key={artwork.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{artwork.title}</CardTitle>
                  <p className="text-muted-foreground">{artwork.artist}</p>
                  <p className="text-sm text-muted-foreground">{artwork.year}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Lager {artwork.warehouse}, Etage {artwork.floor}, Regal {artwork.shelf}, Box {artwork.box}, Ordner {artwork.folder}
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderHierarchicalView = () => {
    // Only show artworks when we're at the deepest level (folder)
    if (currentView.folder) {
      return renderArtworks();
    }

    if (currentView.box) {
      // Show folders in this box (1-5 folders)
      const folders = [1, 2, 3, 4, 5].map(num => ({
        name: `Ordner ${num}`,
        id: num
      }));
      
      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Zurück zum Regal
          </Button>
          <h2 className="section-header">ORDNER IN BOX {currentView.box}</h2>
          {folders.map((folder) => 
            renderLocationCard(
              folder.name, 
              "folder", 
              Math.floor(Math.random() * 3) + 1, // 1-3 artworks per folder
              () => handleLocationClick("folder", folder.id)
            )
          )}
        </div>
      );
    }

    if (currentView.shelf) {
      // Show boxes in this shelf (1-10 boxes)
      const boxes = Array.from({length: 10}, (_, i) => ({
        name: `Box ${i + 1}`,
        id: i + 1
      }));
      
      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Zurück zur Etage
          </Button>
          <h2 className="section-header">BOXEN IN REGAL {currentView.shelf}</h2>
          {boxes.map((box) => 
            renderLocationCard(
              box.name, 
              "box", 
              Math.floor(Math.random() * 8) + 3, // 3-10 folders per box
              () => handleLocationClick("box", box.id)
            )
          )}
        </div>
      );
    }

    if (currentView.floor) {
      // Show shelves in this floor (1-30 shelves)
      const shelves = Array.from({length: 30}, (_, i) => ({
        name: `Regal ${i + 1}`,
        id: i + 1
      }));
      
      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4">
            <ArrowLeft className="mr-2" size={16} /> Zurück zum Lagerhaus
          </Button>
          <h2 className="section-header">REGALE IN ETAGE {currentView.floor}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {shelves.map((shelf) => 
              renderLocationCard(
                shelf.name, 
                "shelf", 
                Math.floor(Math.random() * 50) + 10, // 10-60 boxes per shelf
                () => handleLocationClick("shelf", shelf.id)
              )
            )}
          </div>
        </div>
      );
    }

    if (currentView.warehouse) {
      // Show floors in this warehouse (1-3 floors)
      const floors = [1, 2, 3].map(num => ({
        name: `Etage ${num}`,
        id: num
      }));
      
      return (
        <div>
          <h2 className="section-header">ETAGEN IN LAGERHAUS {currentView.warehouse}</h2>
          {floors.map((floor) => 
            renderLocationCard(
              floor.name, 
              "floor", 
              Math.floor(Math.random() * 200) + 50, // 50-250 shelves per floor
              () => handleLocationClick("floor", floor.id)
            )
          )}
        </div>
      );
    }

    return <div>Wählen Sie ein Lagerhaus aus den Tabs oben aus</div>;
  };

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-header">LAGERHAUS-ORGANISATION</h2>
        </div>
      </div>
      
      <Tabs 
        value={currentView.warehouse || ""} 
        onValueChange={(value) => handleLocationClick("warehouse", value)}
        className="w-full"
      >
        <TabsList className="mb-6 h-12 p-1 grid w-full bg-muted rounded-xl" style={{ gridTemplateColumns: `repeat(${warehouses.length}, 1fr)` }}>
          {warehouses.map(warehouse => (
            <TabsTrigger 
              key={warehouse.id} 
              value={warehouse.id}
              className="text-sm font-medium px-3 py-2 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-ios data-[state=active]:text-foreground"
            >
              {warehouse.name}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {warehouses.map(warehouse => (
          <TabsContent key={warehouse.id} value={warehouse.id} className="space-y-6">
            {renderHierarchicalView()}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};