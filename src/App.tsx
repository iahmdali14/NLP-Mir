import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppLayout } from "@/components/Layout";
import LandingPage from "@/components/landing/LandingPage";
import DashboardPage from "@/components/DashboardPage";
import BenchmarkPage from "@/components/BenchmarkPage";
import PlaygroundPage from "@/components/PlaygroundPage";

export default function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/dashboard/:documentId" element={<AppLayout><DashboardPage /></AppLayout>} />
          <Route path="/benchmark" element={<AppLayout><BenchmarkPage /></AppLayout>} />
          <Route path="/playground" element={<AppLayout><PlaygroundPage /></AppLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}
