import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Slider } from './ui/slider';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { SlidersHorizontal, Leaf, Utensils, ShieldCheck, MapPin, DollarSign, RotateCcw } from 'lucide-react';
import logoImage from 'figma:asset/7a24e14a79f78714a3a479f032002a4172deb07a.png';
import { useTheme } from './ThemeContext';

interface FiltersSheetProps {
  filters: {
    vegan: boolean;
    vegetarian: boolean;
    allergenFriendly: boolean;
    maxDistance: number;
    maxPrice: number;
  };
  onFiltersChange: (filters: any) => void;
  container?: HTMLElement | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onApplyFilters?: () => void;
  onResetFilters?: () => void;
}

export function FiltersSheet({ filters, onFiltersChange, container, open, onOpenChange, onApplyFilters, onResetFilters }: FiltersSheetProps) {
  const { currentTheme } = useTheme();
  const activeFiltersCount = [
    filters.vegan,
    filters.vegetarian,
    filters.allergenFriendly,
    filters.maxDistance < 10,
    filters.maxPrice < 4
  ].filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <SlidersHorizontal className="w-5 h-5" />
          {activeFiltersCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-orange-500 text-white text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-full p-0 rounded-t-3xl" container={container} style={{ height: 'calc(100% - 80px)' }}>
        <div className="flex flex-col h-full">
          <SheetHeader className={`px-3 py-3 border-b bg-gradient-to-r ${currentTheme.cardGradient}`}>
            <div className="flex items-center gap-2">
              <img src={logoImage} alt="Menu Match" className="w-7 h-7" />
              <div className="text-left">
                <SheetTitle className="text-base">Filters</SheetTitle>
                <SheetDescription className="text-xs">
                  {activeFiltersCount > 0 ? `${activeFiltersCount} active` : 'Customize preferences'}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>
          
          <ScrollArea className="flex-1">
            <div className="px-3 py-3 space-y-3">
              {/* Dietary Preferences */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-orange-500" />
                  <h3 className="text-sm text-gray-900">Dietary</h3>
                </div>
                
                <Card className="overflow-hidden border border-orange-100">
                  <div className="divide-y divide-gray-100">
                    <div className="p-2.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <div className="min-w-0">
                          <Label htmlFor="vegan" className="cursor-pointer text-xs block">Vegan</Label>
                          <p className="text-[10px] text-gray-500 leading-tight">Plant-based</p>
                        </div>
                      </div>
                      <Switch
                        id="vegan"
                        checked={filters.vegan}
                        onCheckedChange={(checked) => onFiltersChange({ ...filters, vegan: checked })}
                        className="scale-90"
                      />
                    </div>
                    
                    <div className="p-2.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Leaf className="w-3.5 h-3.5 text-green-500" />
                        </div>
                        <div className="min-w-0">
                          <Label htmlFor="vegetarian" className="cursor-pointer text-xs block">Vegetarian</Label>
                          <p className="text-[10px] text-gray-500 leading-tight">No meat</p>
                        </div>
                      </div>
                      <Switch
                        id="vegetarian"
                        checked={filters.vegetarian}
                        onCheckedChange={(checked) => onFiltersChange({ ...filters, vegetarian: checked })}
                        className="scale-90"
                      />
                    </div>
                    
                    <div className="p-2.5 flex items-center justify-between hover:bg-orange-50/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <Label htmlFor="allergen" className="cursor-pointer text-xs block">Allergen Safe</Label>
                          <p className="text-[10px] text-gray-500 leading-tight">Safe options</p>
                        </div>
                      </div>
                      <Switch
                        id="allergen"
                        checked={filters.allergenFriendly}
                        onCheckedChange={(checked) => onFiltersChange({ ...filters, allergenFriendly: checked })}
                        className="scale-90"
                      />
                    </div>
                  </div>
                </Card>
              </div>
              
              <Separator />
              
              {/* Max Distance */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orange-500" />
                  <h3 className="text-sm text-gray-900">Distance</h3>
                </div>
                
                <Card className="p-2.5 border border-orange-100 bg-gradient-to-br from-white to-orange-50/30">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-600">Max distance</span>
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] px-1.5 py-0">
                        {filters.maxDistance} mi
                      </Badge>
                    </div>
                    <Slider
                      value={[filters.maxDistance]}
                      onValueChange={(value) => onFiltersChange({ ...filters, maxDistance: value[0] })}
                      max={10}
                      min={0.5}
                      step={0.5}
                      className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-500 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:border-0 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>0.5 mi</span>
                      <span>10 mi</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <Separator />
              
              {/* Price Level */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-orange-500" />
                  <h3 className="text-sm text-gray-900">Price</h3>
                </div>
                
                <Card className="p-2.5 border border-orange-100 bg-gradient-to-br from-white to-pink-50/30">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-600">Max price</span>
                      <Badge className="bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] px-1.5 py-0">
                        {'$'.repeat(filters.maxPrice)}
                      </Badge>
                    </div>
                    <Slider
                      value={[filters.maxPrice]}
                      onValueChange={(value) => onFiltersChange({ ...filters, maxPrice: value[0] })}
                      max={4}
                      min={1}
                      step={1}
                      className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-orange-500 [&_[role=slider]]:to-pink-500 [&_[role=slider]]:border-0 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />
                    <div className="flex justify-between text-[10px] text-gray-500">
                      <span>$ Budget</span>
                      <span>$$$$ Luxury</span>
                    </div>
                  </div>
                </Card>
              </div>
              
              <div className="pb-2">
                <Card className="p-2 bg-gradient-to-r from-orange-50 to-pink-50 border-orange-200">
                  <p className="text-[10px] text-gray-600 text-center leading-tight">
                    Find restaurants matching your preferences
                  </p>
                </Card>
              </div>
            </div>
          </ScrollArea>
          
          {/* Footer with buttons */}
          <div className="p-3 border-t bg-white space-y-1.5">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white h-9 text-sm"
              onClick={onApplyFilters}>
              Apply Filters
            </Button>
            
            {activeFiltersCount > 0 && (
              <Button 
                variant="outline"
                className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 h-9 text-xs"
                onClick={onResetFilters}
              >
                <RotateCcw className="w-3 h-3 mr-1.5" />
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
