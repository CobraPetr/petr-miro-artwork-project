import React, { useRef, useEffect, useState } from 'react';
import QrScanner from 'qr-scanner';

const QRScanner = ({ onScan, onClose }) => {
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (videoRef.current && !qrScannerRef.current) {
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result);
          onScan(result.data);
          stopScanning();
        },
        {
          onDecodeError: (error) => {
            // Ignore decode errors, they're normal during scanning
          },
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );
    }

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.destroy();
        qrScannerRef.current = null;
      }
    };
  }, [onScan]);

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);
      await qrScannerRef.current.start();
    } catch (err) {
      setError('Camera access denied or not available');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
    }
    setIsScanning(false);
  };

  const handleClose = () => {
    stopScanning();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">QR Code Scanner</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-gray-100 rounded"
            playsInline
          />
          {!isScanning && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
              <p className="text-gray-600 text-center">Camera ready</p>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="mt-4 flex gap-2">
          {isScanning ? (
            <button
              onClick={stopScanning}
              className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Stop Scanning
            </button>
          ) : (
            <button
              onClick={startScanning}
              className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Start Scanning
            </button>
          )}
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
