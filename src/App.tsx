import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ReportLostPage } from '@/pages/ReportLostPage';
import { ReportFoundPage } from '@/pages/ReportFoundPage';
import { PetsListingPage } from '@/pages/PetsListingPage';
import { PetDetailPage } from '@/pages/PetDetailPage';
import { RefugiosPage } from '@/pages/RefugiosPage';
import { RefugioDetailPage } from '@/pages/RefugioDetailPage';
import { ReportRefugioPage } from '@/pages/ReportRefugioPage';
import { FosterPage } from '@/pages/FosterPage';
import { FosterDetailPage } from '@/pages/FosterDetailPage';
import { ReportMenuPage } from '@/pages/ReportMenuPage';
import { ReportNeedPage } from '@/pages/ReportNeedPage';
import { NeedsListingPage } from '@/pages/NeedsListingPage';
import { NeedDetailPage } from '@/pages/NeedDetailPage';
import { ReportVetPage } from '@/pages/ReportVetPage';
import { VetsPage } from '@/pages/VetsPage';
import { DonatePage } from '@/pages/DonatePage';
import { HelpPage } from '@/pages/HelpPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="reportar" element={<ReportMenuPage />} />
        <Route path="reportar/perdida" element={<ReportLostPage />} />
        <Route path="reportar/encontrada" element={<ReportFoundPage />} />
        <Route path="reportar/refugio" element={<ReportRefugioPage />} />
        <Route path="reportar/centro" element={<Navigate to="/reportar/refugio" replace />} />
        <Route path="reportar/necesidad" element={<ReportNeedPage />} />
        <Route path="necesidades" element={<NeedsListingPage />} />
        <Route path="necesidades/:id" element={<NeedDetailPage />} />
        <Route path="reportar/veterinario" element={<ReportVetPage />} />
        <Route path="veterinarios" element={<VetsPage />} />
        <Route path="donar-insumos" element={<DonatePage />} />
        <Route path="ayudar" element={<HelpPage />} />
        <Route path="mascotas" element={<PetsListingPage />} />
        <Route path="mascotas/:id" element={<PetDetailPage />} />
        <Route path="refugios" element={<RefugiosPage />} />
        <Route path="refugios/:id" element={<RefugioDetailPage />} />
        <Route path="centros" element={<Navigate to="/refugios" replace />} />
        <Route path="centros/:id" element={<Navigate to="/refugios" replace />} />
        <Route path="puedo-ser-hogar-temporal" element={<FosterPage />} />
        <Route path="hogar-temporal/:id" element={<FosterDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
