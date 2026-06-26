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
import { CENTER_TYPE_OPTIONS, NEED_OPTIONS, URGENCY_OPTIONS } from '@/constants/help';
import { useCreateCenterReport } from '@/features/help/hooks';
import type { CenterTypeValue, UrgencyLevel } from '@/types/help';

export function ReportCenterPage() {
  const { toast } = useToast();
  const create = useCreateCenterReport();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [type, setType] = useState<CenterTypeValue | ''>('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [needs, setNeeds] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<UrgencyLevel>('medio');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  function toggleNeed(v: string) {
    setNeeds((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
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
        type,
        city: city.trim(),
        address: address.trim() || null,
        whatsapp: whatsapp.trim() || null,
        needs,
        urgency,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Reporte enviado');
        },
        onError: () => toast('No se pudo enviar. Inténtalo de nuevo.'),
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Reportar centro o rescatista" />
        <SubmittedNotice
          title="Reporte recibido"
          message="Recibimos tu reporte. Lo revisaremos antes de publicarlo."
        >
          <Link to="/centros">
            <Button fullWidth>Volver a centros</Button>
          </Link>
          <Button variant="secondary" fullWidth onClick={() => setSubmitted(false)}>
            Reportar otro
          </Button>
        </SubmittedNotice>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <PageHeading title="Reportar centro o rescatista" subtitle="Ayuda a construir el mapa de ayuda real. Verificamos antes de publicar." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre del centro / rescatista" placeholder="Ej: Punto de acopio La Guaira" value={name} onChange={(e) => setName(e.target.value)} />
        <Select
          label="Tipo"
          placeholder="Selecciona…"
          options={CENTER_TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value as CenterTypeValue)}
        />
        <Input label="Ciudad / sector" placeholder="Ej: Caraballeda, La Guaira" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="Dirección o referencia" placeholder="Ej: Av. La Playa, sector Los Corales" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Qué necesitan?</div>
          <div className="flex flex-wrap gap-2">
            {NEED_OPTIONS.map((n) => (
              <Chip key={n} active={needs.includes(n)} onClick={() => toggleNeed(n)}>
                {n}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Nivel de urgencia</div>
          <div className="flex gap-2">
            {URGENCY_OPTIONS.map((u) => (
              <Chip key={u.value} active={urgency === u.value} onClick={() => setUrgency(u.value)} className="flex-1">
                {u.label}
              </Chip>
            ))}
          </div>
        </div>

        <Textarea label="Notas" placeholder="Cualquier detalle útil para quien quiera ayudar" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <p className="text-center text-sm font-medium text-lost">{error}</p>}
        {create.isError && (
          <p className="text-center text-sm font-medium text-lost">
            Ocurrió un error al enviar. Revisa tu conexión e inténtalo de nuevo.
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Enviar reporte
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu reporte se verifica antes de aparecer públicamente. No se publica automáticamente.
        </p>
      </form>
    </div>
  );
}
