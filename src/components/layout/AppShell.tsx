import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { SafetyBanner } from './SafetyBanner';
import { BottomNav } from './BottomNav';

export function AppShell() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col bg-sand-50 shadow-sm">
      <div className="sticky top-0 z-20">
        <Header />
        <SafetyBanner />
      </div>

      <main className="flex-1 px-4 pb-28 pt-4">
        <Outlet />
      </main>

      <div className="sticky bottom-0 z-20">
        <BottomNav />
      </div>
    </div>
  );
}
