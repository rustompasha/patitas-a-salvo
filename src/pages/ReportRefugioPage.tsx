import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SubmittedNotice } from '@/components/ui/SubmittedNotice';
import { useToast } from '@/components/ui/Toast';
import { normalizeVePhone } from '@/lib/utils';
import { REFUGE_RECEIVE_OPTIONS, REFUGE_TYPE_OPTIONS, refugeTypeToCenterType } from '@/constants/help';
import { useCreateRefugeReport } from '@/features/help/hooks';

export function ReportRefugioPage() {
  const { toast } = useToast();
  const create = useCreateRefugeReport();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [receives, setReceives] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  function toggleReceive(v: string) {
    setReceives((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !type || city.trim().length < 2 || !normalizeVePhone(whatsapp)) {
      setError('Completa nombre, tipo, ciudad y un WhatsApp válido.');
      return;
    }
    setError(null);
    create.mutate(
      {
        name: name.trim(),
        type: refugeTypeToCenterType(type),
        city: city.trim(),
        address: address.trim() || null,
        whatsapp: whatsapp.trim() || null,
        needs: receives,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Refugio registrado');
        },
        onError: () => toast('No se pudo enviar. Inténtalo de nuevo.'),
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Registrar refugio" />
        <SubmittedNotice
          title="Refugio recibido"
          message="Gracias. Publicaremos esta información para que las personas puedan contactarlos directamente por WhatsApp."
        >
          <Link to="/refugios">
            <Button fullWidth>Ver refugios</Button>
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
        title="Registrar refugio"
        subtitle="Refugios, rescatistas, veterinarias aliadas y puntos que pueden recibir animales o insumos."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del refugio / organización / responsable"
          placeholder="Ej: Refugio Patitas, Rescate La Guaira"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Select
          label="Tipo"
          placeholder="Selecciona…"
          options={REFUGE_TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
        <Input label="Ciudad / zona" placeholder="Ej: Caraballeda, La Guaira" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="Dirección o referencia" placeholder="Ej: Av. La Playa, sector Los Corales" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Qué puede recibir?</div>
          <div className="flex flex-wrap gap-2">
            {REFUGE_RECEIVE_OPTIONS.map((r) => (
              <Chip key={r} active={receives.includes(r)} onClick={() => toggleReceive(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </div>

        <Textarea label="Notas" placeholder="Horarios, condiciones, capacidad…" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <p className="text-center text-sm font-medium text-lost">{error}</p>}
        {create.isError && (
          <p className="text-center text-sm font-medium text-lost">
            Ocurrió un error al enviar. Revisa tu conexión e inténtalo de nuevo.
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Registrar refugio
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu refugio aparecerá públicamente para que las personas te contacten por WhatsApp.
        </p>
      </form>
    </div>
  );
}
