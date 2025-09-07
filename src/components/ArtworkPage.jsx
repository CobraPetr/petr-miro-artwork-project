import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useArtwork } from '../context/ArtworkContextDB';
import { ArrowLeft, Calendar, MapPin, DollarSign, Palette, Ruler, Move, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';
import MoveArtworkModal from './MoveArtworkModal';

const ArtworkPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { artworks, loading, moveArtwork } = useArtwork();
  const [artwork, setArtwork] = useState(null);
  const [showMoveModal, setShowMoveModal] = useState(false);

  useEffect(() => {
    if (artworks && id) {
      const foundArtwork = artworks.find(art => art.id === id);
      setArtwork(foundArtwork);
    }
  }, [artworks, id]);

  const handleMoveArtwork = async (artworkId, newLocation) => {
    try {
      await moveArtwork(artworkId, newLocation);
      // Refresh the artwork data
      const updatedArtwork = artworks.find(art => art.id === artworkId);
      if (updatedArtwork) {
        setArtwork({ ...updatedArtwork, warehouse: newLocation });
      }
    } catch (error) {
      console.error('Error moving artwork:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Artwork Not Found</h1>
          <p className="text-muted-foreground mb-6">The artwork you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border/50 sticky top-0 z-50 backdrop-blur-lg bg-background/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Artwork Details</h1>
              <p className="text-sm text-muted-foreground">View and manage artwork information</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card rounded-2xl p-8 shadow-lg">
            {/* Title and Artist */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold text-foreground mb-2">{artwork.title}</h2>
              <p className="text-2xl text-muted-foreground">by {artwork.artist}</p>
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Calendar className="text-blue-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Year</p>
                  <p className="font-semibold text-lg">{artwork.year}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <DollarSign className="text-green-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-semibold text-lg">${artwork.value?.toLocaleString() || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <MapPin className="text-red-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-semibold text-lg">{artwork.warehouse || 'Not specified'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg">
                <Palette className="text-purple-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Medium</p>
                  <p className="font-semibold text-lg">{artwork.medium || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Dimensions */}
            {artwork.dimensions && artwork.dimensions !== 'Unknown' && (
              <div className="flex items-center space-x-3 p-4 bg-muted rounded-lg mb-8">
                <Ruler className="text-orange-500" size={24} />
                <div>
                  <p className="text-sm text-muted-foreground">Dimensions</p>
                  <p className="font-semibold text-lg">{artwork.dimensions}</p>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="space-y-6 mb-8">
              <h3 className="text-2xl font-semibold text-foreground">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                <div>
                  <span className="text-muted-foreground">Category:</span>
                  <span className="ml-2 font-medium">{artwork.category}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Condition:</span>
                  <span className="ml-2 font-medium">{artwork.condition}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className="ml-2 font-medium">{artwork.status}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">ID:</span>
                  <span className="ml-2 font-medium">{artwork.id}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-foreground mb-4">Description</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">{artwork.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowMoveModal(true)}
                className="flex-1 bg-blue-500 text-white py-4 rounded-xl hover:bg-blue-600 font-medium flex items-center justify-center gap-3 text-lg"
              >
                <Move size={20} />
                Move Artwork
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Move Modal */}
      {showMoveModal && (
        <MoveArtworkModal
          artwork={artwork}
          onClose={() => setShowMoveModal(false)}
          onMove={handleMoveArtwork}
        />
      )}

    </div>
  );
};

export default ArtworkPage;
