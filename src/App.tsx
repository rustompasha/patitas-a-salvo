import { Routes, Route } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { HomePage } from '@/pages/HomePage';
import { ReportLostPage } from '@/pages/ReportLostPage';
import { ReportFoundPage } from '@/pages/ReportFoundPage';
import { PetsListingPage } from '@/pages/PetsListingPage';
import { PetDetailPage } from '@/pages/PetDetailPage';
import { CentersPage } from '@/pages/CentersPage';
import { CenterDetailPage } from '@/pages/CenterDetailPage';
import { FosterPage } from '@/pages/FosterPage';
import { ReportMenuPage } from '@/pages/ReportMenuPage';
import { ReportCenterPage } from '@/pages/ReportCenterPage';
import { ReportNeedPage } from '@/pages/ReportNeedPage';
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
        <Route path="reportar/centro" element={<ReportCenterPage />} />
        <Route path="reportar/necesidad" element={<ReportNeedPage />} />
        <Route path="donar-insumos" element={<DonatePage />} />
        <Route path="ayudar" element={<HelpPage />} />
        <Route path="mascotas" element={<PetsListingPage />} />
        <Route path="mascotas/:id" element={<PetDetailPage />} />
        <Route path="centros" element={<CentersPage />} />
        <Route path="centros/:id" element={<CenterDetailPage />} />
        <Route path="puedo-ser-hogar-temporal" element={<FosterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
