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
import { VOLUNTEER_AVAILABILITY_OPTIONS, VOLUNTEER_HELP_OPTIONS } from '@/constants/help';
import { useCreateVolunteer } from '@/features/help/hooks';

export function ReportVoluntarioPage() {
  const { toast } = useToast();
  const create = useCreateVolunteer();
  const [submitted, setSubmitted] = useState(false);

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [helpTypes, setHelpTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [remote, setRemote] = useState(false);
  const [inPerson, setInPerson] = useState(false);
  const [transport, setTransport] = useState(false);
  const [experience, setExperience] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  function toggleHelp(v: string) {
    setHelpTypes((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || city.trim().length < 2 || !normalizeVePhone(whatsapp)) {
      setError('Completa nombre, ciudad y un WhatsApp válido.');
      return;
    }
    if (helpTypes.length === 0) {
      setError('Selecciona al menos una forma de ayudar.');
      return;
    }
    setError(null);
    create.mutate(
      {
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        city: city.trim(),
        state: state.trim() || null,
        area: area.trim() || null,
        availability: availability || null,
        help_types: helpTypes,
        can_help_remote: remote,
        can_help_in_person: inPerson,
        has_transport: transport,
        has_experience: experience,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Te sumaste como voluntario');
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('[volunteer submit] insert failed:', err);
          setError('No pudimos registrarte. Revisa los datos e inténtalo otra vez.');
        },
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Quiero ser voluntario" />
        <SubmittedNotice
          title="Ya formas parte de la red de apoyo"
          message="Gracias por sumarte. Tu información ayudará a conectar casos, refugios, centros de acopio y personas que necesitan apoyo."
        >
          <Link to="/voluntarios">
            <Button fullWidth>Ver voluntarios activos</Button>
          </Link>
          <Link to="/necesidades">
            <Button variant="secondary" fullWidth>
              Ver necesidades urgentes
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" fullWidth>
              Volver al inicio
            </Button>
          </Link>
        </SubmittedNotice>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <PageHeading
        title="Quiero ser voluntario"
        subtitle="Gracias por querer ayudar. Cuéntanos cómo puedes apoyar a la red de rescate."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <Input label="Estado" placeholder="Ej: Miranda (opcional)" value={state} onChange={(e) => setState(e.target.value)} />
        <Input label="Ciudad" placeholder="Ej: Caracas" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="Zona / sector" placeholder="Ej: Los Palos Grandes (opcional)" value={area} onChange={(e) => setArea(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Cómo puedes ayudar?</div>
          <div className="flex flex-wrap gap-2">
            {VOLUNTEER_HELP_OPTIONS.map((h) => (
              <Chip key={h} active={helpTypes.includes(h)} onClick={() => toggleHelp(h)}>
                {h}
              </Chip>
            ))}
          </div>
        </div>

        <Select
          label="Disponibilidad"
          placeholder="Selecciona…"
          options={VOLUNTEER_AVAILABILITY_OPTIONS.map((o) => ({ value: o, label: o }))}
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Modalidad</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={remote} onClick={() => setRemote((p) => !p)}>
              Puedo ayudar remoto
            </Chip>
            <Chip active={inPerson} onClick={() => setInPerson((p) => !p)}>
              Puedo ayudar presencial
            </Chip>
          </div>
        </div>

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Transporte y experiencia</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={transport} onClick={() => setTransport((p) => !p)}>
              Tengo carro o puedo apoyar con traslados
            </Chip>
            <Chip active={experience} onClick={() => setExperience((p) => !p)}>
              Tengo experiencia con rescate animal, refugios o voluntariado
            </Chip>
          </div>
        </div>

        <Textarea
          label="Notas"
          placeholder="Ej: Estoy en Caracas, puedo ayudar a verificar casos por WhatsApp y compartir reportes."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && (
          <p className="rounded-xl bg-[#FBE3E1] px-3.5 py-2.5 text-center text-sm font-semibold text-[#C81E1E]">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Sumarme como voluntario
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu información aparece en la red de voluntarios para coordinar apoyo. Comparte solo datos reales.
        </p>
      </form>
    </div>
  );
}
