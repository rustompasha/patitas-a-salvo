import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ReportLostPage } from '@/pages/ReportLostPage';
import { ReportFoundPage } from '@/pages/ReportFoundPage';
import { PetsListingPage } from '@/pages/PetsListingPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="reportar/perdida" element={<ReportLostPage />} />
        <Route path="reportar/encontrada" element={<ReportFoundPage />} />
        <Route path="mascotas" element={<PetsListingPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
