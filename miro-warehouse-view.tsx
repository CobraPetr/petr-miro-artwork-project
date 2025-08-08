
import React, { useState } from "react";
import { useArtwork, Location } from "@/context/ArtworkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Box, Warehouse, FolderOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const WarehouseView: React.FC = () => {
  const { locations, getArtworksByContainer, setSelectedArtwork, getChildLocations, artworks } = useArtwork();
  const [selectedWarehouse, setSelectedWarehouse] = useState<string>(locations.find(l => l.type === "warehouse")?.id || "");
  const [currentView, setCurrentView] = useState<{
    warehouseId: string;
    etageId?: string;
    shelfId?: string;
    boxId?: string;
  }>({ warehouseId: selectedWarehouse });

  const warehouses = locations.filter(loc => loc.type === "warehouse");
  
  const handleLocationClick = (location: Location) => {
    switch(location.type) {
      case "warehouse":
        setCurrentView({ warehouseId: location.id });
        setSelectedWarehouse(location.id);
        break;
      case "etage":
        setCurrentView({ warehouseId: currentView.warehouseId, etageId: location.id });
        break;
      case "shelf":
        setCurrentView({ 
          warehouseId: currentView.warehouseId, 
          etageId: currentView.etageId, 
          shelfId: location.id 
        });
        break;
      case "box":
        setCurrentView({ 
          warehouseId: currentView.warehouseId, 
          etageId: currentView.etageId, 
          shelfId: currentView.shelfId, 
          boxId: location.id 
        });
        break;
    }
  };

  const navigateBack = () => {
    if (currentView.boxId) {
      setCurrentView({ 
        warehouseId: currentView.warehouseId, 
        etageId: currentView.etageId, 
        shelfId: currentView.shelfId 
      });
    } else if (currentView.shelfId) {
      setCurrentView({ 
        warehouseId: currentView.warehouseId, 
        etageId: currentView.etageId 
      });
    } else if (currentView.etageId) {
      setCurrentView({ warehouseId: currentView.warehouseId });
    }
  };

  const renderLocationIcon = (locationType: string) => {
    switch(locationType) {
      case "warehouse": return <Warehouse size={18} />;
      case "etage": return <FolderOpen size={18} />;
      case "shelf": return <FolderOpen size={18} />;
      case "box": return <Box size={18} />;
      default: return <Box size={18} />;
    }
  };

  // Get all artworks in a specific container and all its children
  const getTotalArtworksInLocation = (locationId: string): number => {
    // Count artworks that are directly in this container
    const directArtworks = artworks.filter(a => a.containerId === locationId);
    
    // Get all child locations
    const childLocations = getChildLocations(locationId);
    
    // For each child location, count their artworks recursively
    const childArtworksCount = childLocations.reduce((sum, child) => {
      return sum + getTotalArtworksInLocation(child.id);
    }, 0);
    
    // Return the total count
    return directArtworks.length + childArtworksCount;
  };

  const renderLocationCard = (location: Location) => {
    const artworksInContainer = getArtworksByContainer(location.id);
    const childLocations = getChildLocations(location.id);
    const hasChildren = childLocations.length > 0;
    // Get total artwork count (direct + in children)
    const totalArtworks = getTotalArtworksInLocation(location.id);

    // Translations for location types
    const getLocationTypeLabel = (type: string, count: number = 1) => {
      switch(type) {
        case "warehouse": return count > 1 ? "Etagen" : "Etage";
        case "etage": return count > 1 ? "Regale" : "Regal";
        case "shelf": return count > 1 ? "Boxen" : "Box";
        default: return type;
      }
    };

    return (
      <motion.div
        key={location.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          className="mb-4 cursor-pointer transition-all duration-200 border-border/50 hover:border-border hover:shadow-ios active:scale-[0.98] bg-card/50 backdrop-blur-sm"
          onClick={() => handleLocationClick(location)}
        >
          <CardHeader className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  {renderLocationIcon(location.type)}
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-1">
                    {location.name}
                  </CardTitle>
                  {hasChildren && (
                    <p className="text-sm text-muted-foreground">
                      {childLocations.length} {getLocationTypeLabel(location.type, childLocations.length)}
                    </p>
                  )}
                </div>
              </div>
              <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">
                {totalArtworks}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {artworksInContainer.length === 0 ? (
              <p className="text-sm text-muted-foreground">Keine Kunstwerke direkt hier gelagert</p>
            ) : (
              <div className="space-y-2">
                {artworksInContainer.slice(0, 3).map(artwork => (
                  <div 
                    key={artwork.id}
                    className="p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors cursor-pointer active:scale-[0.98]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtwork(artwork);
                    }}
                  >
                    <div className="font-medium text-foreground text-sm mb-1">{artwork.name}</div>
                    <div className="text-muted-foreground text-xs">{artwork.artist}</div>
                  </div>
                ))}
                {artworksInContainer.length > 3 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    +{artworksInContainer.length - 3} weitere Kunstwerke
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderHierarchicalView = () => {
    if (currentView.boxId) {
      // Box view - show artworks in this box
      const box = locations.find(l => l.id === currentView.boxId);
      if (!box) return <div>Box nicht gefunden</div>;
      return (
        <div>
          <Button 
            variant="outline" 
            onClick={navigateBack} 
            className="mb-6 w-full sm:w-auto h-11 text-sm border-border/50 hover:bg-muted"
          >
            <ArrowLeft className="mr-2" size={16} /> Zurück zum Regal
          </Button>
          <h2 className="section-header">{box.name.toUpperCase()} INHALT</h2>
          {renderLocationCard(box)}
        </div>
      );
    }
    
    if (currentView.shelfId) {
      // Shelf view - show boxes in this shelf
      const shelf = locations.find(l => l.id === currentView.shelfId);
      if (!shelf) return <div>Regal nicht gefunden</div>;
      const boxes = getChildLocations(currentView.shelfId);

      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4 w-full sm:w-auto h-11 text-sm">
            <ArrowLeft className="mr-2" size={16} /> Zurück zur Etage
          </Button>
          <h2 className="text-base sm:text-lg font-medium mb-4 text-foreground">{shelf.name} Boxen</h2>
          {boxes.length === 0 ? (
            <p className="text-gray-500">Keine Boxen in diesem Regal.</p>
          ) : (
            boxes.map(box => renderLocationCard(box))
          )}
          {renderLocationCard(shelf)}
        </div>
      );
    }
    
    if (currentView.etageId) {
      // Etage view - show shelves in this etage
      const etage = locations.find(l => l.id === currentView.etageId);
      if (!etage) return <div>Etage nicht gefunden</div>;
      const shelves = getChildLocations(currentView.etageId);

      return (
        <div>
          <Button variant="outline" onClick={navigateBack} className="mb-4 w-full sm:w-auto h-11 text-sm">
            <ArrowLeft className="mr-2" size={16} /> Zurück zum Lagerhaus
          </Button>
          <h2 className="text-base sm:text-lg font-medium mb-4 text-foreground">{etage.name} Regale</h2>
          {shelves.length === 0 ? (
            <p className="text-gray-500">Keine Regale in dieser Etage.</p>
          ) : (
            shelves.map(shelf => renderLocationCard(shelf))
          )}
          {renderLocationCard(etage)}
        </div>
      );
    }
    
    // Warehouse view - show etages in this warehouse
    const etages = getChildLocations(currentView.warehouseId);
    const warehouse = locations.find(l => l.id === currentView.warehouseId);
    
    return (
      <div>
        <h2 className="text-base sm:text-lg font-medium mb-4 text-foreground">{warehouse?.name} Etagen</h2>
        {etages.length === 0 ? (
          <p className="text-gray-500">Keine Etagen in diesem Lagerhaus.</p>
        ) : (
          etages.map(etage => renderLocationCard(etage))
        )}
        {renderLocationCard(warehouse!)}
      </div>
    );
  };

  if (warehouses.length === 0) {
    return <div>Keine Lagerhäuser gefunden</div>;
  }

  return (
    <div className="w-full space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="section-header">LAGERHAUS-ORGANISATION</h2>
        </div>
      </div>
      
      <Tabs 
        value={selectedWarehouse} 
        onValueChange={(value) => {
          setSelectedWarehouse(value);
          setCurrentView({ warehouseId: value });
        }}
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
