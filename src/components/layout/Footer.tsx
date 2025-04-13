
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  HeadphonesIcon 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Features section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-8 border-b border-gray-200">
          <div className="flex flex-col items-center text-center">
            <Truck className="h-10 w-10 text-store-purple mb-3" />
            <h3 className="font-semibold mb-1">Free Delivery</h3>
            <p className="text-sm text-gray-600">Orders over $50</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <ShieldCheck className="h-10 w-10 text-store-purple mb-3" />
            <h3 className="font-semibold mb-1">Secure Payment</h3>
            <p className="text-sm text-gray-600">100% secure payment</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <CreditCard className="h-10 w-10 text-store-purple mb-3" />
            <h3 className="font-semibold mb-1">Money Back</h3>
            <p className="text-sm text-gray-600">30 days guarantee</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <HeadphonesIcon className="h-10 w-10 text-store-purple mb-3" />
            <h3 className="font-semibold mb-1">24/7 Support</h3>
            <p className="text-sm text-gray-600">Dedicated support</p>
          </div>
        </div>
        
        {/* Links section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8">
          <div>
            <h2 className="text-lg font-bold mb-4">WildStore</h2>
            <p className="text-gray-600 mb-4">
              Your one-stop shop for all your fashion, electronics, and lifestyle needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-store-purple">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-store-purple">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-store-purple">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-store-purple">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><Link to="/category/women" className="text-gray-600 hover:text-store-purple">Women</Link></li>
              <li><Link to="/category/men" className="text-gray-600 hover:text-store-purple">Men</Link></li>
              <li><Link to="/category/kids" className="text-gray-600 hover:text-store-purple">Kids</Link></li>
              <li><Link to="/category/home" className="text-gray-600 hover:text-store-purple">Home</Link></li>
              <li><Link to="/category/beauty" className="text-gray-600 hover:text-store-purple">Beauty</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Help</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-600 hover:text-store-purple">Contact Us</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-store-purple">FAQs</Link></li>
              <li><Link to="/shipping" className="text-gray-600 hover:text-store-purple">Shipping & Returns</Link></li>
              <li><Link to="/track-order" className="text-gray-600 hover:text-store-purple">Track Order</Link></li>
              <li><Link to="/privacy" className="text-gray-600 hover:text-store-purple">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">About</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-store-purple">About Us</Link></li>
              <li><Link to="/careers" className="text-gray-600 hover:text-store-purple">Careers</Link></li>
              <li><Link to="/blog" className="text-gray-600 hover:text-store-purple">Blog</Link></li>
              <li><Link to="/press" className="text-gray-600 hover:text-store-purple">Press</Link></li>
              <li><Link to="/affiliates" className="text-gray-600 hover:text-store-purple">Affiliates</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} WildStore. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
