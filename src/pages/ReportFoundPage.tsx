import { PetForm } from '@/features/pets/components/PetForm';
import { PageHeading } from './PageHeading';

export function ReportFoundPage() {
  return (
    <div className="animate-fade">
      <PageHeading title="Encontré una mascota" subtitle="Un reporte claro puede ayudar a una familia a reencontrarse." />
      <PetForm status="found" />
    </div>
  );
}
