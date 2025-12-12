import { Outlet } from 'react-router-dom';
import { TopNav } from '../../shared/components/TopNav';

export function AppLayout() {
  return (
    <div className="app-layout">
      <TopNav />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
