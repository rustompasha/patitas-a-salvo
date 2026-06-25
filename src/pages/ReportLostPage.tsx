import { PetForm } from '@/features/pets/components/PetForm';
import { PageHeading } from './PageHeading';

export function ReportLostPage() {
  return (
    <div className="animate-fade">
      <PageHeading title="Perdí mi mascota" subtitle="Publica una alerta para que la comunidad te ayude a encontrarla." />
      <PetForm status="lost" />
    </div>
  );
}
