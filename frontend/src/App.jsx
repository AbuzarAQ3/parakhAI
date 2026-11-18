import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthBootstrapper } from "./components/auth/AuthBootstrapper";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoute";

import { Navbar } from "./components/layout/Navbar";
import { BottomNav } from "./components/layout/BottomNav";
import { Footer } from "./components/layout/Footer";

import { DashboardPage } from "./features/dashboard/DashboardPage";
import { NewInspectionPage } from "./features/inspections/NewInspectionPage";
import { InspectionDetailPage } from "./features/inspections/InspectionDetailPage";
import { HistoryPage } from "./features/history/HistoryPage";
import { RulesPage } from "./features/compliance/RulesPage";
import { ProfilePage } from "./features/profile/ProfilePage";

import { LoginPage } from "./features/auth/LoginPage";
import { SignupPage } from "./features/auth/SignupPage";
import { PendingVerificationPage } from "./features/auth/PendingVerificationPage";
import { VerifyEmailPage } from "./features/auth/VerifyEmailPage";
import { PasswordResetRequestPage } from "./features/auth/PasswordResetRequestPage";
import { PasswordResetConfirmPage } from "./features/auth/PasswordResetConfirmPage";
import { LandingPage } from "./features/landing/LandingPage";
import { useAuth } from "./hooks/useAuth";
import { initTheme } from "./utils/theme";

initTheme();

const HomeRoute = () => {
  const { isAuthenticated, status } = useAuth();
  if (status === "loading") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-parakh-bg">
        <div className="inline-block animate-spin w-8 h-8 border-4 border-parakh-primary border-t-transparent rounded-full" />
      </div>
    );
  }
  return isAuthenticated ? <DashboardPage /> : <LandingPage />;
};

const queryClient = new QueryClient();

export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthBootstrapper>
          <div className="min-h-screen flex flex-col bg-parakh-bg text-parakh-text font-sans selection:bg-blue-600 selection:text-white">
            <Navbar />
            <main className="flex-1 main-content-area">
              <Routes>
               {/* Core Legal Metrology Platform Routes */}
                <Route path="/" element={<HomeRoute />} />
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/inspect" element={<NewInspectionPage />} />
                <Route path="/inspections/:id" element={<InspectionDetailPage />} />
                <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                <Route path="/rules" element={<RulesPage />} />
                <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                {/* Added Authentication & Officer Access Routes */}
                <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                <Route path="/signup" element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
                <Route path="/verify-email/pending" element={<PendingVerificationPage />} />
                <Route path="/account/verify-email/:key" element={<VerifyEmailPage />} />
                <Route path="/account/password/reset" element={<PasswordResetRequestPage />} />
                <Route path="/account/password/reset/key/:key" element={<PasswordResetConfirmPage />} />

                {/* Catch-all redirect to Home Dashboard */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            {/* Footer visible on desktop */}
            <Footer />
            {/* Bottom nav visible on mobile */}
            <BottomNav />
          </div>
        </AuthBootstrapper>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
