import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Eye, EyeOff, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { FilterSettings } from "./FilterControls";
import { ImageFile } from "./FileExplorer";
import { Badge } from "./ui/badge";

interface ImageViewerProps {
  image: ImageFile | null;
  filters: FilterSettings;
  showFilters: boolean;
  onToggleFilters: (show: boolean) => void;
}

export function ImageViewer({
  image,
  filters,
  showFilters,
  onToggleFilters,
}: ImageViewerProps) {
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a demo image for visualization
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Apply filters
      ctx.filter = buildFilterString(filters);
      ctx.drawImage(img, 0, 0);
      
      // Apply threshold effect (custom processing)
      if (filters.threshold > 0) {
        applyThreshold(ctx, canvas.width, canvas.height, filters.threshold);
      }
      
      // Apply sharpness (custom processing)
      if (filters.sharpness > 0) {
        applySharpness(ctx, canvas.width, canvas.height, filters.sharpness);
      }
      
      // Apply gamma correction
      if (filters.gamma !== 1) {
        applyGamma(ctx, canvas.width, canvas.height, filters.gamma);
      }
    };
    
    // Create a demo gradient image representing cell data
    img.src = createDemoCellImage();
  }, [image, filters, showFilters]);

  const buildFilterString = (f: FilterSettings): string => {
    const parts = [
      `brightness(${f.brightness}%)`,
      `contrast(${f.contrast}%)`,
      `saturate(${f.saturation}%)`,
      `blur(${f.blur}px)`,
      `hue-rotate(${f.hue}deg)`,
    ];
    
    if (f.grayscale) parts.push("grayscale(100%)");
    if (f.invert) parts.push("invert(100%)");
    
    return parts.join(" ");
  };

  const applyThreshold = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    threshold: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const thresholdValue = (threshold / 100) * 255;

    for (let i = 0; i < data.length; i += 4) {
      const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      const value = gray > thresholdValue ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = value;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applySharpness = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    sharpness: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const factor = sharpness / 20;

    const kernel = [
      0, -factor, 0,
      -factor, 1 + 4 * factor, -factor,
      0, -factor, 0,
    ];

    const output = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * kernel[kernelIdx];
            }
          }
          const idx = (y * width + x) * 4 + c;
          output[idx] = Math.max(0, Math.min(255, sum));
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      data[i] = output[i];
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const applyGamma = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    gamma: number
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.pow(data[i] / 255, 1 / gamma) * 255;
      data[i + 1] = Math.pow(data[i + 1] / 255, 1 / gamma) * 255;
      data[i + 2] = Math.pow(data[i + 2] / 255, 1 / gamma) * 255;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const createDemoCellImage = (): string => {
    // Create a canvas to draw demo cell data
    const demoCanvas = document.createElement("canvas");
    demoCanvas.width = 800;
    demoCanvas.height = 600;
    const ctx = demoCanvas.getContext("2d");
    if (!ctx) return "";

    // Background
    ctx.fillStyle = "#1a1a2e";
    ctx.fillRect(0, 0, 800, 600);

    // Draw some "cells" as circles with gradient
    const cells = [
      { x: 200, y: 150, r: 40 },
      { x: 400, y: 200, r: 35 },
      { x: 550, y: 300, r: 45 },
      { x: 250, y: 400, r: 38 },
      { x: 600, y: 450, r: 42 },
      { x: 350, y: 500, r: 36 },
    ];

    cells.forEach((cell) => {
      const gradient = ctx.createRadialGradient(
        cell.x,
        cell.y,
        0,
        cell.x,
        cell.y,
        cell.r
      );
      gradient.addColorStop(0, "#00ff88");
      gradient.addColorStop(0.6, "#0088ff");
      gradient.addColorStop(1, "rgba(0, 136, 255, 0.2)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cell.x, cell.y, cell.r, 0, Math.PI * 2);
      ctx.fill();

      // Add some noise/texture
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * cell.r * 0.5;
        const px = cell.x + Math.cos(angle) * dist;
        const py = cell.y + Math.sin(angle) * dist;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3})`;
        ctx.fillRect(px, py, 2, 2);
      }
    });

    return demoCanvas.toDataURL();
  };

  const handleZoomIn = () => setZoom((z) => Math.min(z + 25, 400));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 25, 25));
  const handleZoomReset = () => setZoom(100);

  if (!image) {
    return (
      <div className="flex-1 flex items-center justify-center bg-muted/10">
        <div className="text-center text-muted-foreground">
          <Maximize2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Select an image to view</p>
          <p className="text-sm mt-2">
            Add images from the file explorer to begin
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-muted/10">
      {/* Toolbar */}
      <div className="border-b bg-background/50 backdrop-blur-sm px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{image.name}</Badge>
          {image.timestamp && (
            <Badge variant="outline">Frame: {image.timestamp}</Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border rounded-md">
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomOut}
              disabled={zoom <= 25}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <div className="px-3 text-sm min-w-[60px] text-center border-x">
              {zoom}%
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleZoomIn}
              disabled={zoom >= 400}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" onClick={handleZoomReset}>
            Reset
          </Button>
          <Button
            size="sm"
            variant={showFilters ? "default" : "outline"}
            onClick={() => onToggleFilters(!showFilters)}
          >
            {showFilters ? (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Filtered
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Original
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Image Display */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center justify-center min-h-full">
          <div
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "center",
            }}
            className="transition-transform"
          >
            <canvas
              ref={canvasRef}
              className="border rounded-lg shadow-lg bg-background"
              style={{
                maxWidth: "100%",
                height: "auto",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
