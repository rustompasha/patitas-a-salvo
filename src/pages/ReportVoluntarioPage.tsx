import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { SelfieUpload } from '@/components/ui/SelfieUpload';
import { SubmittedNotice } from '@/components/ui/SubmittedNotice';
import { useToast } from '@/components/ui/Toast';
import { normalizeVePhone } from '@/lib/utils';
import {
  VOLUNTEER_AVAILABILITY_OPTIONS,
  VOLUNTEER_HELP_OPTIONS,
  VOLUNTEER_MODALITY_OPTIONS,
  type VolunteerModality,
} from '@/constants/help';
import { uploadVolunteerPhoto } from '@/features/help/api';
import { useCreateVolunteer } from '@/features/help/hooks';

export function ReportVoluntarioPage() {
  const { toast } = useToast();
  const create = useCreateVolunteer();
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [country, setCountry] = useState('Venezuela');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [modality, setModality] = useState<VolunteerModality | ''>('');
  const [helpTypes, setHelpTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState('');
  const [transport, setTransport] = useState(false);
  const [experience, setExperience] = useState(false);
  const [notes, setNotes] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  function toggleHelp(v: string) {
    setHelpTypes((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2 || !normalizeVePhone(whatsapp)) {
      setError('Completa tu nombre y un WhatsApp válido.');
      return;
    }
    if (!country.trim() || !state.trim() || city.trim().length < 2 || !area.trim()) {
      setError('Completa país, estado, ciudad y zona / sector.');
      return;
    }
    if (!modality) {
      setError('Selecciona tu modalidad de ayuda.');
      return;
    }
    if (helpTypes.length === 0) {
      setError('Selecciona al menos una forma de ayudar.');
      return;
    }
    if (!availability) {
      setError('Selecciona tu disponibilidad.');
      return;
    }
    if (!photo) {
      setError('Sube una foto tipo selfie para completar tu registro.');
      return;
    }
    setError(null);
    setUploading(true);
    try {
      // Upload-first: store the photo, then insert the row with photo fields in a
      // single INSERT (no post-insert update — public UPDATE is intentionally denied).
      const { url, path } = await uploadVolunteerPhoto(photo);
      await create.mutateAsync({
        name: name.trim(),
        whatsapp: whatsapp.trim(),
        country: country.trim(),
        city: city.trim(),
        state: state.trim() || null,
        area: area.trim() || null,
        availability: availability || null,
        help_types: helpTypes,
        modality,
        can_help_remote: modality === 'remote' || modality === 'both',
        can_help_in_person: modality === 'in_person' || modality === 'both',
        has_transport: transport,
        has_experience: experience,
        notes: notes.trim() || null,
        photo_url: url,
        photo_path: path,
        photo_uploaded_at: new Date().toISOString(),
      });
      setSubmitted(true);
      toast('Te sumaste como voluntario');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[volunteer submit] failed:', err);
      setError('No pudimos registrarte. Revisa los datos e inténtalo otra vez.');
    } finally {
      setUploading(false);
    }
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Quiero ser voluntario" />
        <SubmittedNotice
          title="Ya formas parte de la red de apoyo"
          message="Gracias por sumarte. Tu perfil aparecerá en la red de voluntarios para coordinar apoyo, verificar casos, difundir y mover recursos."
        >
          <Link to="/voluntarios">
            <Button fullWidth>Ver la red de voluntarios</Button>
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
        subtitle="Gracias por querer ayudar. Cuéntanos cómo puedes apoyar a la red de rescate — desde Venezuela o desde donde estés."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

        <Input label="País" placeholder="Ej: Venezuela" value={country} onChange={(e) => setCountry(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Estado / provincia" placeholder="Ej: Distrito Capital" value={state} onChange={(e) => setState(e.target.value)} />
          <Input label="Ciudad" placeholder="Ej: Caracas" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <Input label="Zona / sector" placeholder="Ej: Los Palos Grandes" value={area} onChange={(e) => setArea(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Cómo puedes ayudar?</div>
          <div className="flex flex-wrap gap-2">
            {VOLUNTEER_MODALITY_OPTIONS.map((m) => (
              <Chip key={m.value} active={modality === m.value} onClick={() => setModality(m.value)}>
                {m.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Tipo de apoyo</div>
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
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Transporte y experiencia</div>
          <div className="flex flex-wrap gap-2">
            <Chip active={transport} onClick={() => setTransport((p) => !p)}>
              Tengo carro o puedo apoyar con traslados
            </Chip>
            <Chip active={experience} onClick={() => setExperience((p) => !p)}>
              Tengo experiencia con rescate, refugios o voluntariado
            </Chip>
          </div>
        </div>

        <SelfieUpload value={photo} onChange={setPhoto} />

        <Textarea
          label="Notas"
          placeholder="Ej: Estoy fuera del país pero puedo ayudar a verificar casos y difundir por redes."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {error && (
          <p className="rounded-xl bg-[#FBE3E1] px-3.5 py-2.5 text-center text-sm font-semibold text-[#C81E1E]">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={uploading || create.isPending}>
          Sumarme como voluntario
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu información y foto aparecen en la red de voluntarios para coordinar apoyo. Comparte solo
          datos reales.
        </p>
      </form>
    </div>
  );
}
