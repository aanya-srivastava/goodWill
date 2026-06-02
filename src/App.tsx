
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Request from "./pages/Request";
import Donate from "./pages/Donate";
import Pharmacy from "./pages/Pharmacy";
import Redeem from "./pages/Redeem";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import { PointsProvider } from "./contexts/PointsContext";
import { CartProvider } from "./contexts/CartContext";
import { MobileNavigation } from "./components/MobileNavigation";
import { useEffect } from "react";

// Scroll to top component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PointsProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/request" element={<Request />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/redeem" element={<Redeem />} />
              <Route path="/history" element={<History />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <MobileNavigation />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </PointsProvider>
  </QueryClientProvider>
);

export default App;
