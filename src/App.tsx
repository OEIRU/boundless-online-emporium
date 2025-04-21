
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MovieDetail from "./pages/MovieDetail";
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

// Создаем новый экземпляр QueryClient с настройками для обработки ошибок и кэширования
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 300000, // 5 минут
      gcTime: 600000, // 10 минут (заменил cacheTime на gcTime)
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  useEffect(() => {
    logService.info('CinemaVerse application initialized');
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
                <Route path="/movie/:id" element={<MovieDetail />} />
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
                
                {/* Страницы помощи */}
                <Route path="/help" element={<HelpPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/faq" element={<FAQPage />} />
                
                {/* Страницы о компании */}
                <Route path="/about" element={<HistoryPage />} />
                <Route path="/about/history" element={<HistoryPage />} />
                <Route path="/about/careers" element={<CareersPage />} />
                <Route path="/about/press" element={<PressPage />} />
                <Route path="/about/sustainability" element={<SustainabilityPage />} />
                
                {/* Юридические страницы */}
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
