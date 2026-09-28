/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { SearchFilterModal } from './components/shared/SearchFilterModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AnalyzePage } from './pages/AnalyzePage';
import { AnalysisResultPage } from './pages/AnalysisResultPage';
import { MakeupPage } from './pages/MakeupPage';
import { HairstylePage } from './pages/HairstylePage';
import { OutfitsPage } from './pages/OutfitsPage';
import { OccasionPage } from './pages/OccasionPage';
import { FestivalPage } from './pages/FestivalPage';
import { StylePage } from './pages/StylePage';
import { GenerateLookPage } from './pages/GenerateLookPage';
import { SavedPage } from './pages/SavedPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { AdminPage } from './pages/AdminPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname === '/' ? '/home' : window.location.pathname;
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    return new URLSearchParams(window.location.search);
  });

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync with browser history back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname === '/' ? '/home' : window.location.pathname;
      setCurrentPath(path);
      setSearchParams(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (fullPath: string) => {
    const [pathPart, queryPart] = fullPath.split('?');
    const targetPath = pathPart === '/' ? '/home' : pathPart;

    window.history.pushState({}, '', fullPath);
    setCurrentPath(targetPath);
    setSearchParams(new URLSearchParams(queryPart || ''));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render appropriate view based on current path
  const renderCurrentView = () => {
    // Admin routes
    if (currentPath.startsWith('/admin')) {
      return <AdminPage navigate={navigate} />;
    }

    switch (currentPath) {
      case '/home':
        return <HomePage navigate={navigate} />;

      case '/analyze':
        return (
          <AnalyzePage
            navigate={navigate}
            defaultMode={searchParams.get('mode') === 'photo' ? 'photo' : 'photo'}
          />
        );

      case '/analysis-result':
        return <AnalysisResultPage navigate={navigate} />;

      case '/makeup':
        return <MakeupPage navigate={navigate} />;

      case '/hairstyle':
        return <HairstylePage navigate={navigate} />;

      case '/outfits':
        return <OutfitsPage navigate={navigate} />;

      case '/occasion':
        return <OccasionPage navigate={navigate} />;

      case '/festival':
        return <FestivalPage navigate={navigate} />;

      case '/style':
        return <StylePage navigate={navigate} />;

      case '/generate-look':
        return (
          <GenerateLookPage
            navigate={navigate}
            initialParams={{
              skin: searchParams.get('skin') || undefined,
              face: searchParams.get('face') || undefined,
              body: searchParams.get('body') || undefined,
              styles: searchParams.get('styles') || undefined,
              occasion: searchParams.get('occasion') || undefined,
              festival: searchParams.get('festival') || undefined,
            }}
          />
        );

      case '/saved':
        return <SavedPage navigate={navigate} />;

      case '/profile':
        return <ProfilePage navigate={navigate} />;

      case '/login':
        return <LoginPage navigate={navigate} initialMode="login" />;

      case '/register':
        return <LoginPage navigate={navigate} initialMode="register" />;

      case '/about':
        return <AboutPage navigate={navigate} />;

      default:
        return <HomePage navigate={navigate} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-neutral-900 selection:bg-rose-100 selection:text-rose-900">
        {/* Top Navigation */}
        <Navbar
          currentPath={currentPath}
          navigate={navigate}
          openSearch={() => setIsSearchOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {renderCurrentView()}
        </main>

        {/* Global Footer */}
        <Footer navigate={navigate} />

        {/* Mobile Sticky Bottom Nav */}
        <BottomNav currentPath={currentPath} navigate={navigate} />

        {/* Search & Filter Modal */}
        <SearchFilterModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          navigate={navigate}
        />
      </div>
    </AuthProvider>
  );
}
