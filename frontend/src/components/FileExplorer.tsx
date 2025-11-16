import { useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Upload, FolderOpen, X, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "./ui/badge";

export interface ImageFile {
  id: string;
  name: string;
  path: string;
  timestamp?: string;
}

interface FileExplorerProps {
  images: ImageFile[];
  selectedImage: ImageFile | null;
  onImageSelect: (image: ImageFile) => void;
  onImagesAdd: (files: ImageFile[]) => void;
  onImageRemove: (id: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

export function FileExplorer({
  images,
  selectedImage,
  onImageSelect,
  onImagesAdd,
  onImageRemove,
  onReorder,
}: FileExplorerProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileInput = () => {
    // In a real Tauri app, you'd use the Tauri file dialog API
    // For now, we'll simulate with demo data
    const newImages: ImageFile[] = [
      {
        id: `img-${Date.now()}-1`,
        name: "cell_frame_001.tif",
        path: "/demo/cell_frame_001.tif",
        timestamp: "0:00",
      },
      {
        id: `img-${Date.now()}-2`,
        name: "cell_frame_002.tif",
        path: "/demo/cell_frame_002.tif",
        timestamp: "0:05",
      },
    ];
    onImagesAdd(newImages);
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      onReorder(draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < images.length) {
      onReorder(index, newIndex);
    }
  };

  return (
    <div className="h-full flex flex-col border-r bg-muted/20">
      <div className="p-4 border-b">
        <h2 className="mb-3">Timeline Images</h2>
        <div className="flex gap-2">
          <Button onClick={handleFileInput} className="flex-1" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Add Images
          </Button>
        </div>
        <div className="mt-2 text-muted-foreground text-sm">
          {images.length} image{images.length !== 1 ? "s" : ""}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-muted-foreground">
              <FolderOpen className="h-12 w-12 mb-3 opacity-50" />
              <p className="text-sm">No images loaded</p>
              <p className="text-xs mt-1">Add images to begin tracking</p>
            </div>
          ) : (
            <div className="space-y-1">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    group relative p-2 rounded-md border cursor-pointer transition-colors
                    ${
                      selectedImage?.id === image.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background hover:bg-muted border-transparent"
                    }
                    ${draggedIndex === index ? "opacity-50" : ""}
                  `}
                  onClick={() => onImageSelect(image)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs shrink-0">
                          {index + 1}
                        </Badge>
                        <p className="text-sm truncate">{image.name}</p>
                      </div>
                      {image.timestamp && (
                        <p className="text-xs opacity-70 mt-1">
                          {image.timestamp}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(index, "up");
                        }}
                        disabled={index === 0}
                      >
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          moveImage(index, "down");
                        }}
                        disabled={index === images.length - 1}
                      >
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onImageRemove(image.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
