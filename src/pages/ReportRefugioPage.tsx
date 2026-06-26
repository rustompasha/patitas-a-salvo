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
import {
  REFUGE_RECEIVE_OPTIONS,
  REFUGE_STATUS_OPTIONS,
  REFUGE_TYPE_OPTIONS,
  refugeTypeToCenterType,
} from '@/constants/help';
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
  const [status, setStatus] = useState('Activo');
  const [capacity, setCapacity] = useState('');
  const [currentAnimals, setCurrentAnimals] = useState('');
  const [pmBank, setPmBank] = useState('');
  const [pmId, setPmId] = useState('');
  const [pmPhone, setPmPhone] = useState('');
  const [zelleEmail, setZelleEmail] = useState('');
  const [paypalEmail, setPaypalEmail] = useState('');
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
        status: status || null,
        capacity: capacity.trim() || null,
        current_animals: currentAnimals.trim() || null,
        payment_mobile_bank: pmBank.trim() || null,
        payment_mobile_id: pmId.trim() || null,
        payment_mobile_phone: pmPhone.trim() || null,
        zelle_email: zelleEmail.trim() || null,
        paypal_email: paypalEmail.trim() || null,
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

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Estado</div>
          <div className="flex flex-wrap gap-2">
            {REFUGE_STATUS_OPTIONS.map((s) => (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Capacidad" placeholder="Ej: 30 animales" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          <Input label="Animales actuales" placeholder="Ej: 22" value={currentAnimals} onChange={(e) => setCurrentAnimals(e.target.value)} />
        </div>

        <div className="rounded-2xl border border-sand-200 bg-[#FBF8F1] p-3.5">
          <div className="text-[13px] font-extrabold text-forest-dark">Recibir donaciones</div>
          <p className="mt-0.5 text-[11.5px] text-muted">Opcional. Solo se mostrarán los datos que completes.</p>

          <div className="mt-3 text-[12px] font-bold text-[#3A4650]">Pago Móvil</div>
          <div className="mt-2 space-y-2">
            <Input label="Banco" placeholder="Ej: Mercantil" value={pmBank} onChange={(e) => setPmBank(e.target.value)} />
            <Input label="Cédula" placeholder="Ej: V-12345678" value={pmId} onChange={(e) => setPmId(e.target.value)} />
            <Input label="Teléfono" placeholder="Ej: 0412-1234567" inputMode="tel" value={pmPhone} onChange={(e) => setPmPhone(e.target.value)} />
          </div>

          <div className="mt-4 text-[12px] font-bold text-[#3A4650]">Zelle</div>
          <div className="mt-2">
            <Input label="Email" placeholder="correo@email.com" inputMode="email" value={zelleEmail} onChange={(e) => setZelleEmail(e.target.value)} />
          </div>

          <div className="mt-4 text-[12px] font-bold text-[#3A4650]">PayPal</div>
          <div className="mt-2">
            <Input label="Email" placeholder="correo@email.com" inputMode="email" value={paypalEmail} onChange={(e) => setPaypalEmail(e.target.value)} />
          </div>
        </div>

        <Textarea label="Notas" placeholder="Horarios, condiciones, necesidades específicas…" value={notes} onChange={(e) => setNotes(e.target.value)} />

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
