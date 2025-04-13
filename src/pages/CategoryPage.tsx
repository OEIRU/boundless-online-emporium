
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
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

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 500]);
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  const clearFilters = () => {
    setPriceRange([0, 500]);
    // Reset other filters
  };
  
  const capitalizedCategory = category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Products';
  
  return (
    <PageLayout>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{capitalizedCategory}</h1>
        <p className="text-gray-600">Browse our collection of {category} products</p>
      </div>
      
      {/* Mobile Filter Toggle Button */}
      <div className="flex justify-between items-center mb-6 md:hidden">
        <span className="text-sm text-gray-500">Showing 24 products</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={toggleFilters}
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`${
          showFilters ? 'block' : 'hidden'
        } md:block bg-white p-4 md:p-0 rounded-lg md:bg-transparent md:rounded-none fixed inset-0 z-40 md:relative md:z-0 overflow-auto`}>
          <div className="md:sticky md:top-28">
            <div className="flex justify-between items-center mb-6 md:hidden">
              <h2 className="font-bold text-lg">Filters</h2>
              <Button variant="ghost" size="sm" onClick={toggleFilters}>
                <FilterX className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-store-purple">
                Clear All
              </Button>
            </div>
            
            <Accordion type="multiple" defaultValue={["price", "brand", "size"]}>
              <AccordionItem value="price" className="border-b">
                <AccordionTrigger className="py-3">Price Range</AccordionTrigger>
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
                        ${priceRange[0]}
                      </div>
                      <div className="text-gray-500">-</div>
                      <div className="border rounded p-2 text-sm">
                        ${priceRange[1]}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="brand" className="border-b">
                <AccordionTrigger className="py-3">Brand</AccordionTrigger>
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
                <AccordionTrigger className="py-3">Size</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-3 gap-2">
                    {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                      <Button 
                        key={size} 
                        variant="outline" 
                        className="h-9"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="color" className="border-b">
                <AccordionTrigger className="py-3">Color</AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: "Black", color: "#000000" },
                      { name: "White", color: "#FFFFFF", border: true },
                      { name: "Red", color: "#FF0000" },
                      { name: "Blue", color: "#0000FF" },
                      { name: "Green", color: "#00FF00" },
                      { name: "Yellow", color: "#FFFF00" },
                    ].map((color) => (
                      <div
                        key={color.name}
                        className="w-8 h-8 rounded-full cursor-pointer"
                        style={{ 
                          backgroundColor: color.color,
                          border: color.border ? "1px solid #e2e8f0" : "none"
                        }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="discount" className="border-b">
                <AccordionTrigger className="py-3">Discount</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {["10% or more", "20% or more", "30% or more", "40% or more", "50% or more"].map((discount) => (
                      <div key={discount} className="flex items-center space-x-2">
                        <Checkbox id={`discount-${discount}`} />
                        <Label htmlFor={`discount-${discount}`} className="text-sm cursor-pointer">{discount}</Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="mt-6 py-4 md:hidden">
              <Button className="w-full bg-store-purple hover:bg-store-purple-dark" onClick={toggleFilters}>
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:col-span-3">
          {/* Sort and Results Count */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-gray-500 hidden md:block">Showing 24 products</span>
            <div className="flex items-center space-x-2 ml-auto">
              <span className="text-sm text-gray-500 mr-2">Sort by:</span>
              <Select defaultValue="featured">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Customer Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products */}
          <ProductGrid title="" categoryFilter={capitalizedCategory} />
        </div>
      </div>
    </PageLayout>
  );
};

export default CategoryPage;
