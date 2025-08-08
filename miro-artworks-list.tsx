
import React, { useState } from "react";
import { useArtwork } from "@/context/ArtworkContext";
import { ArtworkCard } from "./ArtworkCard";
import { LocationFilter } from "./LocationFilter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export const ArtworksList: React.FC = () => {
  const { artworks } = useArtwork();
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredArtworks = artworks.filter(artwork => {
    const locationMatch = selectedLocation === "all" || artwork.locationId === selectedLocation;
    const searchMatch = artwork.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        artwork.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return locationMatch && searchMatch;
  });

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
          placeholder="Nach Name oder Künstler suchen..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-12 text-base bg-muted/50 border-border/50 rounded-xl"
        />
      </div>

      <LocationFilter 
        onSelectLocation={setSelectedLocation}
        selectedLocation={selectedLocation}
      />

      {filteredArtworks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-base">Keine Kunstwerke gefunden, die Ihren Kriterien entsprechen.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {filteredArtworks.map((artwork, index) => (
            <motion.div
              key={artwork.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
              }}
            >
              <ArtworkCard artwork={artwork} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
