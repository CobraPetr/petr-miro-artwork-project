import React, { useState } from "react";
import { useArtwork } from "../context/ArtworkContextDB";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";

export const ArtworksList = () => {
  const { artworks, loading } = useArtwork();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArtworks = (artworks || []).filter(artwork => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      artwork.title?.toLowerCase().includes(query) ||
      artwork.artist?.toLowerCase().includes(query) ||
      artwork.category?.toLowerCase().includes(query)
    );
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Kunstwerke werden geladen...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-6"
    >
      {/* Section Header */}
      <div>
        <h2 className="section-header">ALLE KUNSTWERKE</h2>
      </div>

      {/* Search Bar */}
      <div className="w-full">
        <Label htmlFor="search" className="sr-only">Suche</Label>
        <Input
          id="search"
          type="text"
          placeholder="Nach Titel, Künstler oder Kategorie suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 text-base bg-muted/50 border-border/50 rounded-xl"
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredArtworks.length} von {artworks?.length || 0} Kunstwerken
        </p>
      </div>

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-base">
            {searchQuery 
              ? "Keine Kunstwerke gefunden, die Ihren Suchkriterien entsprechen."
              : "Keine Kunstwerke in der Datenbank gefunden."
            }
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
        >
          {filteredArtworks.map((artwork) => (
            <motion.div
              key={artwork.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
            >
              <Card className="cursor-pointer transition-all duration-200 border-border/50 hover:border-border hover:shadow-ios active:scale-[0.98] bg-card/50 backdrop-blur-sm h-full">
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                      {artwork.title}
                    </CardTitle>
                    {artwork.value && (
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-xs ml-2">
                        €{artwork.value.toLocaleString()}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {artwork.artist}
                    </p>
                    {artwork.year && (
                      <p className="text-xs text-muted-foreground">
                        {artwork.year}
                      </p>
                    )}
                    {artwork.category && (
                      <Badge variant="outline" className="text-xs">
                        {artwork.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2">
                    {artwork.medium && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Medium:</span> {artwork.medium}
                      </p>
                    )}
                    {artwork.dimensions && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Größe:</span> {artwork.dimensions}
                      </p>
                    )}
                    {artwork.condition && (
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Zustand:</span> {artwork.condition}
                      </p>
                    )}
                    
                    {/* Location Info */}
                    <div className="pt-2 border-t border-border/20">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Standort:</span> {' '}
                        Lager {artwork.warehouse || '-'}, 
                        Etage {artwork.floor || '-'}, 
                        Regal {artwork.shelf || '-'}
                        {artwork.box && `, Box ${artwork.box}`}
                        {artwork.folder && `, Ordner ${artwork.folder}`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};