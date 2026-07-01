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
import { cn, normalizeVePhone } from '@/lib/utils';
import {
  BRIGADE_AVAILABILITY_OPTIONS,
  BRIGADE_EQUIPMENT_OPTIONS,
  BRIGADE_EXPERIENCE_OPTIONS,
  BRIGADE_MUNICIPALITY_OPTIONS,
  BRIGADE_ROLE_POINTS,
  BRIGADE_SAFETY_POINTS,
} from '@/constants/brigade';
import { useCreateBrigadeMember } from '@/features/brigade/hooks';

/** Segmented Sí / No control for a boolean field. Safety-critical answers should
 *  read unambiguously, so we use an explicit two-option toggle. */
function YesNo({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div>
      <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">{label}</div>
      <div className="flex gap-2">
        {[
          { v: true, t: 'Sí' },
          { v: false, t: 'No' },
        ].map(({ v, t }) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(v)}
            className={cn(
              'flex-1 rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold transition',
              value === v
                ? 'border-forest bg-forest text-white'
                : 'border-sand-300 bg-white text-[#3A4650]',
            )}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BrigadaPage() {
  const { toast } = useToast();
  const create = useCreateBrigadeMember();
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [sector, setSector] = useState('');
  const [age, setAge] = useState('');
  const [occupation, setOccupation] = useState('');
  const [canTravel, setCanTravel] = useState(false);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleType, setVehicleType] = useState('');
  const [availability, setAvailability] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [firstAid, setFirstAid] = useState(false);
  const [vetTraining, setVetTraining] = useState(false);
  const [animalHandling, setAnimalHandling] = useState(false);
  const [disasterResp, setDisasterResp] = useState(false);
  const [rescueDesc, setRescueDesc] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [motivation, setMotivation] = useState('');
  const [error, setError] = useState<string | null>(null);

  function toggleEquipment(v: string) {
    setEquipment((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (fullName.trim().length < 2 || !normalizeVePhone(whatsapp)) {
      setError('Completa tu nombre completo y un WhatsApp válido.');
      return;
    }
    if (!municipality) {
      setError('Selecciona tu municipio de residencia.');
      return;
    }
    const ageNum = age.trim() ? Number(age) : NaN;
    if (!Number.isInteger(ageNum) || ageNum < 18 || ageNum > 99) {
      setError('Debes ser mayor de edad (18+) para postularte a la brigada.');
      return;
    }
    if (emergencyName.trim().length < 2 || !normalizeVePhone(emergencyPhone)) {
      setError('Un contacto de emergencia (nombre y teléfono) es obligatorio por seguridad.');
      return;
    }
    setError(null);
    create.mutate(
      {
        full_name: fullName.trim(),
        whatsapp: whatsapp.trim(),
        municipality,
        sector: sector.trim() || null,
        age: ageNum,
        occupation: occupation.trim() || null,
        can_travel_to_la_guaira: canTravel,
        has_vehicle: hasVehicle,
        vehicle_type: hasVehicle ? vehicleType.trim() || null : null,
        availability: availability || null,
        experience_level: experienceLevel || null,
        first_aid_training: firstAid,
        veterinary_training: vetTraining,
        animal_handling_experience: animalHandling,
        disaster_response_experience: disasterResp,
        rescue_experience_description: rescueDesc.trim() || null,
        equipment_available: equipment,
        emergency_contact_name: emergencyName.trim(),
        emergency_contact_phone: emergencyPhone.trim(),
        motivation: motivation.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Postulación recibida');
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('[brigade apply] insert failed:', err);
          setError('No pudimos registrar tu postulación. Revisa los datos e inténtalo otra vez.');
        },
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Brigada de Respuesta Animal" />
        <SubmittedNotice
          title="Postulación recibida"
          message="Gracias por postularte. Tu solicitud entra en evaluación: nadie se activa como brigadista sin aprobación previa. Te contactaremos por WhatsApp para coordinar los siguientes pasos. Ninguna operación se realiza sin coordinación y evaluación."
        >
          <Link to="/brigada/directorio">
            <Button fullWidth>Ver brigadistas activos</Button>
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
        title="Brigada de Respuesta Animal"
        subtitle="Buscamos personas capacitadas o con experiencia que puedan apoyar operaciones de rescate, traslado, atención primaria, logística y respuesta animal en situaciones de emergencia."
      />

      {/* Safety-first warning — this brigade never authorizes high-risk intervention. */}
      <div className="mb-4 rounded-2xl border border-[#F3C7BE] bg-[#FDF1EC] p-4">
        <div className="flex items-center gap-2">
          <span className="text-lg" aria-hidden>
            ⚠️
          </span>
          <h2 className="text-[13.5px] font-extrabold text-[#B23B12]">La seguridad es lo primero</h2>
        </div>
        <p className="mt-2 text-[12.5px] leading-relaxed text-[#7A3B24]">
          La participación en esta brigada no autoriza intervenciones de alto riesgo. Nunca pongas
          tu vida en peligro. Todas las operaciones deben coordinarse y evaluarse previamente.
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {BRIGADE_SAFETY_POINTS.map((p) => (
            <li key={p} className="flex gap-2 text-[12px] leading-snug text-[#7A3B24]">
              <span aria-hidden className="mt-[2px] text-[#B23B12]">
                •
              </span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* What a brigadista does — animal field support, distinct from general volunteers. */}
      <div className="mb-5 rounded-2xl border border-[#CFE6D6] bg-[#F1F8F3] p-4">
        <h2 className="text-[13.5px] font-extrabold text-forest-dark">¿Qué hace un brigadista?</h2>
        <p className="mt-1 text-[12px] leading-snug text-muted">
          Equipo de campo en Caracas para apoyo animal coordinado, con capacidad de desplazarse a
          La Guaira. Es distinto al voluntariado general.
        </p>
        <ul className="mt-2.5 space-y-1.5">
          {BRIGADE_ROLE_POINTS.map((p) => (
            <li key={p} className="flex gap-2 text-[12px] leading-snug text-[#2F4A3C]">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                className="mt-[2px] shrink-0"
                aria-hidden
              >
                <path d="M5 12l4 4 10-10" stroke="#1F7A6D" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre completo"
          placeholder="Tu nombre y apellido"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <Input
          label="WhatsApp"
          placeholder="0412…"
          inputMode="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />

        <Select
          label="Municipio de residencia"
          placeholder="Selecciona…"
          options={BRIGADE_MUNICIPALITY_OPTIONS.map((o) => ({ value: o, label: o }))}
          value={municipality}
          onChange={(e) => setMunicipality(e.target.value)}
        />
        <Input
          label="Zona o sector"
          placeholder="Ej: Los Palos Grandes (opcional)"
          value={sector}
          onChange={(e) => setSector(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Edad"
            placeholder="Ej: 28"
            inputMode="numeric"
            value={age}
            onChange={(e) => setAge(e.target.value.replace(/\D/g, ''))}
          />
          <Input
            label="Profesión u ocupación"
            placeholder="Ej: Enfermero"
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
          />
        </div>

        <YesNo label="¿Puedes movilizarte a La Guaira?" value={canTravel} onChange={setCanTravel} />

        <YesNo label="¿Tienes vehículo?" value={hasVehicle} onChange={setHasVehicle} />
        {hasVehicle && (
          <Input
            label="Tipo de vehículo"
            placeholder="Ej: Camioneta, moto, carro…"
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          />
        )}

        <Select
          label="Disponibilidad"
          placeholder="Selecciona…"
          options={BRIGADE_AVAILABILITY_OPTIONS.map((o) => ({ value: o, label: o }))}
          value={availability}
          onChange={(e) => setAvailability(e.target.value)}
        />

        <Select
          label="Nivel de experiencia"
          placeholder="Selecciona…"
          options={BRIGADE_EXPERIENCE_OPTIONS.map((o) => ({ value: o, label: o }))}
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
        />

        <div className="space-y-3 rounded-2xl border border-sand-200 bg-[#FBF8F1] p-3.5">
          <YesNo label="¿Tienes formación en primeros auxilios?" value={firstAid} onChange={setFirstAid} />
          <YesNo label="¿Tienes formación veterinaria?" value={vetTraining} onChange={setVetTraining} />
          <YesNo
            label="¿Has trabajado con animales rescatados?"
            value={animalHandling}
            onChange={setAnimalHandling}
          />
          <YesNo
            label="¿Has participado en rescates o emergencias anteriormente?"
            value={disasterResp}
            onChange={setDisasterResp}
          />
        </div>

        <Textarea
          label="Describe tu experiencia"
          placeholder="Cuéntanos brevemente tu experiencia con rescate, manejo de animales, traslados o emergencias."
          value={rescueDesc}
          onChange={(e) => setRescueDesc(e.target.value)}
        />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Equipo disponible</div>
          <div className="flex flex-wrap gap-2">
            {BRIGADE_EQUIPMENT_OPTIONS.map((eq) => (
              <Chip key={eq} active={equipment.includes(eq)} onClick={() => toggleEquipment(eq)}>
                {eq}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-3 rounded-2xl border border-sand-200 bg-white p-3.5">
          <div className="text-[12.5px] font-bold text-[#3A4650]">Contacto de emergencia</div>
          <Input
            label="Nombre"
            placeholder="Nombre de tu contacto"
            value={emergencyName}
            onChange={(e) => setEmergencyName(e.target.value)}
          />
          <Input
            label="Teléfono"
            placeholder="0412…"
            inputMode="tel"
            value={emergencyPhone}
            onChange={(e) => setEmergencyPhone(e.target.value)}
          />
        </div>

        <Textarea
          label="¿Por qué quieres formar parte de la brigada?"
          placeholder="Cuéntanos tu motivación."
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
        />

        {error && (
          <p className="rounded-xl bg-[#FBE3E1] px-3.5 py-2.5 text-center text-sm font-semibold text-[#C81E1E]">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Enviar postulación
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu postulación entra en evaluación. Nadie se activa como brigadista sin aprobación previa.
          Comparte solo datos reales.
        </p>
      </form>
    </div>
  );
}
