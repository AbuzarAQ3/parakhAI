import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { DashboardPage } from "./features/dashboard/DashboardPage";
import { NewInspectionPage } from "./features/inspections/NewInspectionPage";
import { InspectionDetailPage } from "./features/inspections/InspectionDetailPage";
import { HistoryPage } from "./features/history/HistoryPage";
import { RulesPage } from "./features/compliance/RulesPage";
import { ProfilePage } from "./features/profile/ProfilePage";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#f4f6f9] text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/inspect" element={<NewInspectionPage />} />
              <Route path="/inspections/:id" element={<InspectionDetailPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/rules" element={<RulesPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
