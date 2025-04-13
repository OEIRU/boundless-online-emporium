
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const banners = [
  {
    id: 1,
    title: 'Spring Collection 2025',
    subtitle: 'Discover fresh styles for the new season',
    cta: 'Shop Now',
    link: '/category/women',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    bgColor: 'from-purple-500/80 to-pink-500/80'
  },
  {
    id: 2,
    title: 'Tech Essentials',
    subtitle: 'The latest gadgets at unbeatable prices',
    cta: 'Explore',
    link: '/category/electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    bgColor: 'from-blue-500/80 to-cyan-500/80'
  },
  {
    id: 3,
    title: 'Home & Living',
    subtitle: 'Transform your space with our collection',
    cta: 'Shop Collection',
    link: '/category/home',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80',
    bgColor: 'from-amber-500/80 to-yellow-500/80'
  }
];

const HeroBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const banner = banners[currentBanner];

  return (
    <div className="relative overflow-hidden rounded-lg h-[300px] md:h-[400px] lg:h-[500px] mt-1">
      {/* Banner Image */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={banner.image} 
          alt={banner.title} 
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-75`}></div>
      </div>
      
      {/* Banner Content */}
      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3">{banner.title}</h2>
          <p className="text-lg md:text-xl opacity-90 mb-6">{banner.subtitle}</p>
          <Link to={banner.link}>
            <Button size="lg" className="bg-white text-store-purple hover:bg-gray-100">
              {banner.cta}
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Navigation Buttons */}
      <button 
        onClick={prevBanner} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button 
        onClick={nextBanner} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full p-2"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
      
      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full ${
              index === currentBanner ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentBanner(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;
