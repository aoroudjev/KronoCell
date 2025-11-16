import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { ChevronDown, RotateCcw } from "lucide-react";
import { useState } from "react";

export interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpness: number;
  threshold: number;
  grayscale: boolean;
  invert: boolean;
  hue: number;
  gamma: number;
}

export const defaultFilters: FilterSettings = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sharpness: 0,
  threshold: 0,
  grayscale: false,
  invert: false,
  hue: 0,
  gamma: 1,
};

interface FilterControlsProps {
  globalFilters: FilterSettings;
  perImageFilters: Map<string, FilterSettings>;
  selectedImageId: string | null;
  onGlobalFilterChange: (filters: FilterSettings) => void;
  onPerImageFilterChange: (imageId: string, filters: FilterSettings) => void;
  usePerImageFilters: boolean;
  onTogglePerImageFilters: (enabled: boolean) => void;
}

export function FilterControls({
  globalFilters,
  perImageFilters,
  selectedImageId,
  onGlobalFilterChange,
  onPerImageFilterChange,
  usePerImageFilters,
  onTogglePerImageFilters,
}: FilterControlsProps) {
  const [openSections, setOpenSections] = useState({
    colorAdjustments: true,
    effects: true,
    advanced: false,
  });

  const currentFilters = usePerImageFilters && selectedImageId
    ? perImageFilters.get(selectedImageId) || defaultFilters
    : globalFilters;

  const updateFilter = (key: keyof FilterSettings, value: number | boolean) => {
    const newFilters = { ...currentFilters, [key]: value };
    
    if (usePerImageFilters && selectedImageId) {
      onPerImageFilterChange(selectedImageId, newFilters);
    } else {
      onGlobalFilterChange(newFilters);
    }
  };

  const resetFilters = () => {
    if (usePerImageFilters && selectedImageId) {
      onPerImageFilterChange(selectedImageId, defaultFilters);
    } else {
      onGlobalFilterChange(defaultFilters);
    }
  };

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="h-full flex flex-col border-l bg-muted/20">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2>Filters</h2>
          <Button size="sm" variant="ghost" onClick={resetFilters}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="per-image-mode" className="text-sm">
            Per-image filters
          </Label>
          <Switch
            id="per-image-mode"
            checked={usePerImageFilters}
            onCheckedChange={onTogglePerImageFilters}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {usePerImageFilters
            ? "Each image has individual settings"
            : "All images share the same settings"}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Color Adjustments */}
          <Collapsible
            open={openSections.colorAdjustments}
            onOpenChange={() => toggleSection("colorAdjustments")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full pb-2">
              <h3 className="text-sm">Color Adjustments</h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openSections.colorAdjustments ? "" : "-rotate-90"
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Brightness</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.brightness}%
                  </span>
                </div>
                <Slider
                  value={[currentFilters.brightness]}
                  onValueChange={([value]) => updateFilter("brightness", value)}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Contrast</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.contrast}%
                  </span>
                </div>
                <Slider
                  value={[currentFilters.contrast]}
                  onValueChange={([value]) => updateFilter("contrast", value)}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Saturation</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.saturation}%
                  </span>
                </div>
                <Slider
                  value={[currentFilters.saturation]}
                  onValueChange={([value]) => updateFilter("saturation", value)}
                  min={0}
                  max={200}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Hue Rotate</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.hue}°
                  </span>
                </div>
                <Slider
                  value={[currentFilters.hue]}
                  onValueChange={([value]) => updateFilter("hue", value)}
                  min={0}
                  max={360}
                  step={1}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Effects */}
          <Collapsible
            open={openSections.effects}
            onOpenChange={() => toggleSection("effects")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full pb-2 border-t pt-4">
              <h3 className="text-sm">Effects</h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openSections.effects ? "" : "-rotate-90"
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Blur</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.blur}px
                  </span>
                </div>
                <Slider
                  value={[currentFilters.blur]}
                  onValueChange={([value]) => updateFilter("blur", value)}
                  min={0}
                  max={10}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Sharpness</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.sharpness}%
                  </span>
                </div>
                <Slider
                  value={[currentFilters.sharpness]}
                  onValueChange={([value]) => updateFilter("sharpness", value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Threshold</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.threshold}%
                  </span>
                </div>
                <Slider
                  value={[currentFilters.threshold]}
                  onValueChange={([value]) => updateFilter("threshold", value)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="grayscale" className="text-sm">
                  Grayscale
                </Label>
                <Switch
                  id="grayscale"
                  checked={currentFilters.grayscale}
                  onCheckedChange={(checked) => updateFilter("grayscale", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="invert" className="text-sm">
                  Invert Colors
                </Label>
                <Switch
                  id="invert"
                  checked={currentFilters.invert}
                  onCheckedChange={(checked) => updateFilter("invert", checked)}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Advanced */}
          <Collapsible
            open={openSections.advanced}
            onOpenChange={() => toggleSection("advanced")}
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full pb-2 border-t pt-4">
              <h3 className="text-sm">Advanced</h3>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  openSections.advanced ? "" : "-rotate-90"
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Gamma</Label>
                  <span className="text-xs text-muted-foreground">
                    {currentFilters.gamma.toFixed(2)}
                  </span>
                </div>
                <Slider
                  value={[currentFilters.gamma]}
                  onValueChange={([value]) => updateFilter("gamma", value)}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
}
