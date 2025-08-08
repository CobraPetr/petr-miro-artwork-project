import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

export interface Artwork {
  id: string;
  name: string;
  artist: string;
  year: number;
  image?: string;
  locationId: string;
  containerType: "warehouse" | "etage" | "shelf" | "box";
  containerId: string;
}

export interface Location {
  id: string;
  name: string;
  type: "warehouse" | "etage" | "shelf" | "box";
  parentId?: string; // For hierarchy: etages within warehouses, shelves within etages, etc.
}

// Sample data with hierarchical structure
const initialLocations: Location[] = [
  // Warehouses
  { id: "w1", name: "Lagerhaus 1", type: "warehouse" },
  { id: "w2", name: "Lagerhaus 2", type: "warehouse" },
  { id: "w3", name: "Lagerhaus 3", type: "warehouse" },
  { id: "w4", name: "Lagerhaus 4", type: "warehouse" },
  
  // Etages (floors) in Warehouse 1
  { id: "e1", name: "Etage 1", type: "etage", parentId: "w1" },
  { id: "e2", name: "Etage 2", type: "etage", parentId: "w1" },
  { id: "e3", name: "Etage 3", type: "etage", parentId: "w1" },
  
  // Etages in Warehouse 2
  { id: "e4", name: "Etage 1", type: "etage", parentId: "w2" },
  { id: "e5", name: "Etage 2", type: "etage", parentId: "w2" },
  { id: "e6", name: "Etage 3", type: "etage", parentId: "w2" },
  
  // Etages in Warehouse 3
  { id: "e7", name: "Etage 1", type: "etage", parentId: "w3" },
  { id: "e8", name: "Etage 2", type: "etage", parentId: "w3" },
  
  // Etages in Warehouse 4
  { id: "e9", name: "Etage 1", type: "etage", parentId: "w4" },
  
  // Shelves in Etage 1 of Warehouse 1
  { id: "s1", name: "Regal A", type: "shelf", parentId: "e1" },
  { id: "s2", name: "Regal B", type: "shelf", parentId: "e1" },
  { id: "s3", name: "Regal C", type: "shelf", parentId: "e1" },
  
  // Shelves in Etage 2 of Warehouse 1
  { id: "s4", name: "Regal A", type: "shelf", parentId: "e2" },
  { id: "s5", name: "Regal B", type: "shelf", parentId: "e2" },
  
  // Shelves in Etage 3 of Warehouse 1
  { id: "s6", name: "Regal A", type: "shelf", parentId: "e3" },
  
  // Shelves in Etage 1 of Warehouse 2
  { id: "s7", name: "Regal A", type: "shelf", parentId: "e4" },
  { id: "s8", name: "Regal B", type: "shelf", parentId: "e4" },
  
  // Shelves in Etage 1 of Warehouse 3
  { id: "s9", name: "Regal A", type: "shelf", parentId: "e7" },
  { id: "s10", name: "Regal B", type: "shelf", parentId: "e7" },
  
  // Boxes in Shelf A of Etage 1 (Warehouse 1)
  { id: "b1", name: "Box 1", type: "box", parentId: "s1" },
  { id: "b2", name: "Box 2", type: "box", parentId: "s1" },
  { id: "b3", name: "Box 3", type: "box", parentId: "s1" },
  
  // Boxes in Shelf B of Etage 1 (Warehouse 1)
  { id: "b4", name: "Box 1", type: "box", parentId: "s2" },
  { id: "b5", name: "Box 2", type: "box", parentId: "s2" },
  
  // Boxes in Shelf C of Etage 1 (Warehouse 1)
  { id: "b6", name: "Box 1", type: "box", parentId: "s3" },
  
  // Boxes in Shelf A of Etage 2 (Warehouse 1)
  { id: "b7", name: "Box 1", type: "box", parentId: "s4" },
  { id: "b8", name: "Box 2", type: "box", parentId: "s4" },
  
  // Boxes in Shelf A of Etage 1 (Warehouse 2)
  { id: "b9", name: "Box 1", type: "box", parentId: "s7" },
  { id: "b10", name: "Box 2", type: "box", parentId: "s7" },
  
  // Boxes in Shelf A of Etage 1 (Warehouse 3)
  { id: "b11", name: "Box 1", type: "box", parentId: "s9" },
];

const initialArtworks: Artwork[] = [
  // Artworks in Warehouse 1
  {
    id: "a1",
    name: "Sonnenblumen",
    artist: "Klaus Meyer",
    year: 2020,
    locationId: "w1",
    containerType: "box",
    containerId: "b1"
  },
  {
    id: "a2",
    name: "Berglandschaft",
    artist: "Lena Schmidt",
    year: 2018,
    locationId: "w1",
    containerType: "box",
    containerId: "b2"
  },
  {
    id: "a3",
    name: "Waldweg",
    artist: "Klaus Meyer",
    year: 2021,
    locationId: "w1",
    containerType: "box",
    containerId: "b3"
  },
  {
    id: "a4",
    name: "Stadtleben",
    artist: "Sarah Müller",
    year: 2019,
    locationId: "w1",
    containerType: "box",
    containerId: "b4"
  },
  {
    id: "a5",
    name: "Segelboot",
    artist: "Thomas Weber",
    year: 2022,
    locationId: "w1",
    containerType: "box",
    containerId: "b5"
  },
  {
    id: "a6",
    name: "Wolkenhimmel",
    artist: "Lena Schmidt",
    year: 2017,
    locationId: "w1",
    containerType: "box",
    containerId: "b6"
  },
  {
    id: "a7",
    name: "Herbstwald",
    artist: "Klaus Meyer",
    year: 2019,
    locationId: "w1",
    containerType: "box",
    containerId: "b7"
  },
  {
    id: "a8",
    name: "Winterlandschaft",
    artist: "Sarah Müller",
    year: 2020,
    locationId: "w1",
    containerType: "box",
    containerId: "b8"
  },
  
  // Artworks in Warehouse 2
  {
    id: "a9",
    name: "Abstrakte Komposition",
    artist: "Martin Fischer",
    year: 2021,
    locationId: "w2",
    containerType: "box",
    containerId: "b9"
  },
  {
    id: "a10",
    name: "Moderne Stadt",
    artist: "Julia König",
    year: 2022,
    locationId: "w2",
    containerType: "box",
    containerId: "b10"
  },
  {
    id: "a11",
    name: "Wasserspiegelung",
    artist: "Martin Fischer",
    year: 2019,
    locationId: "w2",
    containerType: "etage",
    containerId: "e5"
  },
  {
    id: "a12",
    name: "Portraitstudie",
    artist: "Julia König",
    year: 2020,
    locationId: "w2",
    containerType: "etage",
    containerId: "e6"
  },
  
  // Artworks in Warehouse 3
  {
    id: "a13",
    name: "Farbexplosion",
    artist: "Felix Wagner",
    year: 2021,
    locationId: "w3",
    containerType: "box",
    containerId: "b11"
  },
  {
    id: "a14",
    name: "Geometrische Formen",
    artist: "Hannah Becker",
    year: 2020,
    locationId: "w3",
    containerType: "shelf",
    containerId: "s10"
  },
  {
    id: "a15",
    name: "Lichtspiel",
    artist: "Felix Wagner",
    year: 2022,
    locationId: "w3",
    containerType: "etage",
    containerId: "e8"
  },
  
  // Artworks in Warehouse 4
  {
    id: "a16",
    name: "Ozeanwellen",
    artist: "Eva Schulz",
    year: 2018,
    locationId: "w4",
    containerType: "warehouse",
    containerId: "w4"
  },
  {
    id: "a17",
    name: "Nebel im Tal",
    artist: "David Richter",
    year: 2023,
    locationId: "w4",
    containerType: "etage",
    containerId: "e9"
  }
];

interface ArtworkContextType {
  artworks: Artwork[];
  locations: Location[];
  moveArtwork: (artworkId: string, newContainerId: string, containerType: "warehouse" | "etage" | "shelf" | "box") => void;
  getLocationById: (id: string) => Location | undefined;
  getLocationName: (containerId: string) => string;
  getArtworksByLocation: (locationId: string) => Artwork[];
  getArtworksByContainer: (containerId: string) => Artwork[];
  getChildLocations: (parentId: string) => Location[];
  selectedArtwork: Artwork | null;
  setSelectedArtwork: (artwork: Artwork | null) => void;
}

const ArtworkContext = createContext<ArtworkContextType | undefined>(undefined);

export const ArtworkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [locations] = useState<Location[]>(initialLocations);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const { toast } = useToast();

  const moveArtwork = (artworkId: string, newContainerId: string, containerType: "warehouse" | "etage" | "shelf" | "box") => {
    const container = locations.find(l => l.id === newContainerId);
    if (!container) return;

    setArtworks(prevArtworks => {
      return prevArtworks.map(artwork => {
        if (artwork.id === artworkId) {
          toast({
            title: "Artwork Moved",
            description: `${artwork.name} moved to ${container.name}`,
          });
          return {
            ...artwork,
            locationId: container.parentId || newContainerId,
            containerType,
            containerId: newContainerId
          };
        }
        return artwork;
      });
    });
  };

  const getLocationById = (id: string) => {
    return locations.find(location => location.id === id);
  };

  const getLocationName = (containerId: string) => {
    const location = locations.find(l => l.id === containerId);
    return location ? location.name : "Unknown";
  };

  const getArtworksByLocation = (locationId: string) => {
    return artworks.filter(artwork => artwork.locationId === locationId);
  };

  const getArtworksByContainer = (containerId: string) => {
    return artworks.filter(artwork => artwork.containerId === containerId);
  };

  const getChildLocations = (parentId: string) => {
    return locations.filter(location => location.parentId === parentId);
  };

  return (
    <ArtworkContext.Provider
      value={{
        artworks,
        locations,
        moveArtwork,
        getLocationById,
        getLocationName,
        getArtworksByLocation,
        getArtworksByContainer,
        getChildLocations,
        selectedArtwork,
        setSelectedArtwork
      }}
    >
      {children}
    </ArtworkContext.Provider>
  );
};

export const useArtwork = (): ArtworkContextType => {
  const context = useContext(ArtworkContext);
  if (context === undefined) {
    throw new Error("useArtwork must be used within an ArtworkProvider");
  }
  return context;
};
