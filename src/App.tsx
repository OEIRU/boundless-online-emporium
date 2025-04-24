
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import RequireAuth from "./components/auth/RequireAuth";
import RequireAdmin from "./components/auth/RequireAdmin";
import ContactPage from "./pages/help/ContactPage";
import FAQPage from "./pages/help/FAQPage";
import HelpPage from "./pages/help/HelpPage";
import CartPage from "./pages/CartPage";
import ProductDetail from "./pages/ProductDetail";
import { useEffect } from "react";
import { logService } from "./services/LogService";

// About pages
import HistoryPage from "./pages/about/HistoryPage";
import CareersPage from "./pages/about/CareersPage";
import PressPage from "./pages/about/PressPage";
import SustainabilityPage from "./pages/about/SustainabilityPage";

// Legal pages
import TermsPage from "./pages/legal/TermsPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import CookiesPage from "./pages/legal/CookiesPage";

// Create a new QueryClient instance with settings for error handling and caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 300000, // 5 minutes
      gcTime: 600000, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    logService.info('WildStore application initialized');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                
                <Route path="/profile" element={
                  <RequireAuth>
                    <ProfilePage />
                  </RequireAuth>
                } />
                
                {/* Help pages */}
                <Route path="/help" element={<HelpPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                
                {/* About company pages */}
                <Route path="/about" element={<HistoryPage />} />
                <Route path="/about/history" element={<HistoryPage />} />
                <Route path="/about/careers" element={<CareersPage />} />
                <Route path="/about/press" element={<PressPage />} />
                <Route path="/about/sustainability" element={<SustainabilityPage />} />
                
                {/* Legal pages */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                
                {/* Admin routes could go here if needed */}
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
