import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SubmittedNotice } from '@/components/ui/SubmittedNotice';
import { useToast } from '@/components/ui/Toast';
import { normalizeVePhone } from '@/lib/utils';
import { VET_SERVICE_OPTIONS } from '@/constants/help';
import { useCreateVetReport } from '@/features/help/hooks';

export function ReportVetPage() {
  const { toast } = useToast();
  const create = useCreateVetReport();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [clinic, setClinic] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [address, setAddress] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  function toggleService(v: string) {
    setServices((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || city.trim().length < 2 || !normalizeVePhone(whatsapp)) {
      setError('Completa nombre, ciudad y un WhatsApp válido.');
      return;
    }
    setError(null);
    create.mutate(
      {
        name: name.trim(),
        clinic_name: clinic.trim() || null,
        city: city.trim(),
        whatsapp: whatsapp.trim(),
        address: address.trim() || null,
        services,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Veterinario registrado');
        },
        onError: () => toast('No se pudo enviar. Inténtalo de nuevo.'),
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Puedo ayudar como veterinario" />
        <SubmittedNotice
          title="¡Gracias por sumarte!"
          message="Tu disponibilidad ya está publicada y visible para quienes necesiten atención veterinaria."
        >
          <Link to="/veterinarios">
            <Button fullWidth>Ver veterinarios</Button>
          </Link>
          <Button variant="secondary" fullWidth onClick={() => setSubmitted(false)}>
            Registrar otro
          </Button>
        </SubmittedNotice>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <PageHeading
        title="Puedo ayudar como veterinario"
        subtitle="Publica tu disponibilidad. Se muestra de inmediato para quienes necesiten atención."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Clínica" placeholder="Nombre de la clínica (opcional)" value={clinic} onChange={(e) => setClinic(e.target.value)} />
        <Input label="Ciudad / sector" placeholder="Ej: Caraballeda, La Guaira" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <Input label="Dirección o referencia" placeholder="Ej: Av. La Playa, sector Los Corales" value={address} onChange={(e) => setAddress(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Servicios</div>
          <div className="flex flex-wrap gap-2">
            {VET_SERVICE_OPTIONS.map((s) => (
              <Chip key={s} active={services.includes(s)} onClick={() => toggleService(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        <Textarea label="Notas" placeholder="Horarios, condiciones, especialidades…" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <p className="text-center text-sm font-medium text-lost">{error}</p>}
        {create.isError && (
          <p className="text-center text-sm font-medium text-lost">
            Ocurrió un error al enviar. Revisa tu conexión e inténtalo de nuevo.
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Publicar disponibilidad
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu disponibilidad aparece públicamente de inmediato. Comparte solo información real.
        </p>
      </form>
    </div>
  );
}
