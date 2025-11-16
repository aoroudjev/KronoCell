import { useState } from "react";
import { FileExplorer, ImageFile } from "./components/FileExplorer";
import { FilterControls, FilterSettings, defaultFilters } from "./components/FilterControls";
import { ImageViewer } from "./components/ImageViewer";

export default function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageFile | null>(null);
  const [globalFilters, setGlobalFilters] = useState<FilterSettings>(defaultFilters);
  const [perImageFilters, setPerImageFilters] = useState<Map<string, FilterSettings>>(new Map());
  const [usePerImageFilters, setUsePerImageFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  const handleImagesAdd = (newImages: ImageFile[]) => {
    setImages((prev) => [...prev, ...newImages]);
    if (!selectedImage && newImages.length > 0) {
      setSelectedImage(newImages[0]);
    }
  };

  const handleImageRemove = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (selectedImage?.id === id) {
      setSelectedImage(null);
    }
    // Clean up per-image filters
    setPerImageFilters((prev) => {
      const updated = new Map(prev);
      updated.delete(id);
      return updated;
    });
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handlePerImageFilterChange = (imageId: string, filters: FilterSettings) => {
    setPerImageFilters((prev) => {
      const updated = new Map(prev);
      updated.set(imageId, filters);
      return updated;
    });
  };

  const getCurrentFilters = (): FilterSettings => {
    if (usePerImageFilters && selectedImage) {
      return perImageFilters.get(selectedImage.id) || defaultFilters;
    }
    return globalFilters;
  };

  return (
    <div className="size-full flex">
      {/* File Explorer - Left Sidebar */}
      <div className="w-64 shrink-0">
        <FileExplorer
          images={images}
          selectedImage={selectedImage}
          onImageSelect={setSelectedImage}
          onImagesAdd={handleImagesAdd}
          onImageRemove={handleImageRemove}
          onReorder={handleReorder}
        />
      </div>

      {/* Main Image Viewer */}
      <ImageViewer
        image={selectedImage}
        filters={showFilters ? getCurrentFilters() : defaultFilters}
        showFilters={showFilters}
        onToggleFilters={setShowFilters}
      />

      {/* Filter Controls - Right Sidebar */}
      <div className="w-80 shrink-0">
        <FilterControls
          globalFilters={globalFilters}
          perImageFilters={perImageFilters}
          selectedImageId={selectedImage?.id || null}
          onGlobalFilterChange={setGlobalFilters}
          onPerImageFilterChange={handlePerImageFilterChange}
          usePerImageFilters={usePerImageFilters}
          onTogglePerImageFilters={setUsePerImageFilters}
        />
      </div>
    </div>
  );
}
