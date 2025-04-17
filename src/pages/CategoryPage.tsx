
import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FilterX, SlidersHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortOption, setSortOption] = useState("featured");
  const [loading, setLoading] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [discountFilter, setDiscountFilter] = useState(0);
  
  // Apply parameters from URL on load
  useEffect(() => {
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const sort = searchParams.get('sort');
    const sizes = searchParams.get('sizes');
    const colors = searchParams.get('colors');
    const minDiscount = searchParams.get('min_discount');
    
    if (minPrice && maxPrice) {
      setPriceRange([parseInt(minPrice), parseInt(maxPrice)]);
    }
    
    if (sort) {
      setSortOption(sort);
    }
    
    if (sizes) {
      setSelectedSizes(sizes.split(','));
    }
    
    if (colors) {
      setSelectedColors(colors.split(','));
    }
    
    if (minDiscount) {
      setDiscountFilter(parseInt(minDiscount));
    }
  }, [searchParams]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    updateSearchParams('min_price', value[0].toString());
    updateSearchParams('max_price', value[1].toString());
  };
  
  const handleSortChange = (value: string) => {
    setSortOption(value);
    updateSearchParams('sort', value);
    
    setLoading(true);
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Сортировка применена",
        description: "Товары отсортированы по выбранному параметру",
        duration: 1500,
      });
    }, 500);
  };
  
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev => {
      const newSizes = prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size];
        
      // Update URL params
      if (newSizes.length > 0) {
        updateSearchParams('sizes', newSizes.join(','));
      } else {
        searchParams.delete('sizes');
        setSearchParams(searchParams);
      }
      
      return newSizes;
    });
  };
  
  const handleColorToggle = (color: string) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color];
        
      // Update URL params
      if (newColors.length > 0) {
        updateSearchParams('colors', newColors.join(','));
      } else {
        searchParams.delete('colors');
        setSearchParams(searchParams);
      }
      
      return newColors;
    });
  };
  
  const handleDiscountChange = (value: string) => {
    const discount = parseInt(value);
    setDiscountFilter(discount);
    
    if (discount > 0) {
      updateSearchParams('min_discount', value);
    } else {
      searchParams.delete('min_discount');
      setSearchParams(searchParams);
    }
  };
  
  const updateSearchParams = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams);
  };
  
  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSortOption("featured");
    setSelectedSizes([]);
    setSelectedColors([]);
    setDiscountFilter(0);
    setSearchParams(new URLSearchParams());
    
    toast({
      title: "Фильтры сброшены",
      description: "Все фильтры были сброшены",
      duration: 1500,
    });
  };
  
  // Display categories in Russian
  const getCategoryName = (categorySlug: string | undefined): string => {
    if (!categorySlug) return 'Товары';
    
    switch(categorySlug) {
      case 'women': return 'Женщинам';
      case 'men': return 'Мужчинам';
      case 'kids': return 'Детям';
      case 'home': return 'Дом';
      case 'electronics': return 'Электроника';
      case 'beauty': return 'Красота';
      case 'sports': return 'Спорт';
      case 'shoes': return 'Обувь';
      default: return categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);
    }
  };
  
  const capitalizedCategory = getCategoryName(category);
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{capitalizedCategory}</h1>
        <p className="text-gray-600">Просмотрите нашу коллекцию товаров для категории {capitalizedCategory.toLowerCase()}</p>
      </div>
      
      {/* Mobile Filter Toggle Button */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <span className="text-sm text-gray-500">Показано 24 товара</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Фильтры
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`${
          showFilters ? 'block' : 'hidden'
        } md:block bg-white p-4 md:p-0 rounded-lg md:bg-transparent md:rounded-none fixed inset-0 z-40 md:relative md:z-0 overflow-auto`}>
          <div className="md:sticky md:top-28">
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="font-bold text-lg">Фильтры</h2>
              <Button variant="ghost" size="sm" onClick={toggleFilters}>
                <FilterX className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Фильтры</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-store-purple">
                Очистить все
              </Button>
            </div>
            
            <Accordion type="multiple" defaultValue={["price", "brand", "size", "color", "discount"]}>
              <AccordionItem value="price" className="border-b">
                <AccordionTrigger className="py-3">Диапазон цен</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-2 mb-6">
                    <Slider
                      defaultValue={[0, 500]}
                      max={1000}
                      step={10}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="border rounded p-2 text-sm">
                        ₽{priceRange[0]}
                      </div>
                      <div className="text-gray-500">-</div>
                      <div className="border rounded p-2 text-sm">
                        ₽{priceRange[1]}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="brand" className="border-b">
                <AccordionTrigger className="py-3">Бренд</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["Nike", "Adidas", "Puma", "Reebok", "Under Armour"].map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox id={`brand-${brand}`} />
                        <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">{brand}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="size" className="border-b">
                <AccordionTrigger className="py-3">Размер</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <Button 
                        key={size} 
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        className="h-9"
                        onClick={() => handleSizeToggle(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="color" className="border-b">
                <AccordionTrigger className="py-3">Цвет</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Черный", color: "#000000" },
                      { name: "Белый", color: "#FFFFFF", border: true },
                      { name: "Красный", color: "#FF0000" },
                      { name: "Синий", color: "#0000FF" },
                      { name: "Зеленый", color: "#00FF00" },
                      { name: "Желтый", color: "#FFFF00" },
                    ].map((color) => (
                      <div
                        key={color.name}
                        className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                          selectedColors.includes(color.name) ? 'ring-2 ring-store-purple ring-offset-2' : ''
                        }`}
                        style={{ 
                          backgroundColor: color.color,
                          border: color.border ? "1px solid #e2e8f0" : "none"
                        }}
                        title={color.name}
                        onClick={() => handleColorToggle(color.name)}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="discount" className="border-b">
                <AccordionTrigger className="py-3">Скидка</AccordionTrigger>
                <AccordionContent>
                  <RadioGroup 
                    value={discountFilter.toString()} 
                    onValueChange={handleDiscountChange}
                  >
                    {[
                      { label: "Все товары", value: "0" },
                      { label: "10% или больше", value: "10" },
                      { label: "20% или больше", value: "20" },
                      { label: "30% или больше", value: "30" },
                      { label: "40% или больше", value: "40" },
                      { label: "50% или больше", value: "50" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 py-1">
                        <RadioGroupItem value={option.value} id={`discount-${option.value}`} />
                        <Label htmlFor={`discount-${option.value}`} className="text-sm cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 py-4 md:hidden">
              <Button className="w-full bg-store-purple hover:bg-store-purple-dark" onClick={toggleFilters}>
                Применить фильтры
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 hidden md:block">Показано 24 товара</span>
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-500 mr-2">Сортировать по:</span>
              <Select value={sortOption} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Сортировать по" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Популярности</SelectItem>
                  <SelectItem value="newest">Новизне</SelectItem>
                  <SelectItem value="price_asc">Цена: по возрастанию</SelectItem>
                  <SelectItem value="price_desc">Цена: по убыванию</SelectItem>
                  <SelectItem value="rating">Рейтингу</SelectItem>
                  <SelectItem value="discount">Скидке</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products */}
          <ProductGrid 
            title="" 
            categoryFilter={capitalizedCategory} 
            sortOption={sortOption}
            priceRange={priceRange}
            sizeFilters={selectedSizes}
            colorFilters={selectedColors}
            discountFilter={discountFilter}
          />
        </div>
      </div>
    </PageLayout>
  );
};

export default CategoryPage;
