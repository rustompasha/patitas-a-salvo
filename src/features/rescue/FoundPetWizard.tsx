import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ShareButton } from '@/components/contact/ShareButton';
import { PageHeading } from '@/pages/PageHeading';
import { PetForm } from '@/features/pets/components/PetForm';
import { petShareText } from '@/features/pets/petHelpers';
import { useCreateNeedReport } from '@/features/help/hooks';
import { FINDER_HELP_OPTIONS } from '@/constants/help';
import type { Pet } from '@/types/pet';
import { ChoiceButton } from './components/ChoiceButton';
import { ShelterMatchList } from './components/ShelterMatchList';
import { MatchSection } from './components/MatchSection';

type Step = 'intro' | 'shelters' | 'help' | 'care' | 'immediate' | 'form' | 'done';

/** Compose the human-readable current-care location: most specific part first. */
function joinLocation(sector: string, city: string, state: string): string {
  return [sector, city, state]
    .map((s) => s.trim())
    .filter(Boolean)
    .join(', ');
}

function StepHint({ n, total }: { n: number; total: number }) {
  return (
    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-faint">
      Paso {n} de {total}
    </p>
  );
}

function BackLink({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="mt-5 text-[12.5px] font-bold text-forest">
      ← Atrás
    </button>
  );
}

/**
 * Guided "encontré una mascota" flow. Instead of dropping users on a publish form,
 * it walks them toward real support (shelters / temporary homes / supplies) so a
 * found animal never becomes a rescue dead-end.
 *
 * Logistics note: the *found* location (where the animal was seen) and the *current
 * care* location (where help should be delivered) are not the same place. For the
 * "can keep it" branch we capture the current care location separately and use THAT
 * for the auto-created need and all matching.
 */
export function FoundPetWizard() {
  const createNeed = useCreateNeedReport();

  const [step, setStep] = useState<Step>('intro');
  const [canKeep, setCanKeep] = useState(false);
  const [zone, setZone] = useState('');
  const [help, setHelp] = useState<string[]>([]);
  const [wantsImmediate, setWantsImmediate] = useState(false);
  const [needQuantity, setNeedQuantity] = useState('');
  const [needNotes, setNeedNotes] = useState('');

  // Current care location (where help is delivered) — kept distinct from found location.
  const [careState, setCareState] = useState('');
  const [careCity, setCareCity] = useState('');
  const [careSector, setCareSector] = useState('');
  const [careReference, setCareReference] = useState('');
  const [careError, setCareError] = useState<string | null>(null);

  const [published, setPublished] = useState<Pet | null>(null);
  const [needCreated, setNeedCreated] = useState(false);

  const careLocation = joinLocation(careSector, careCity, careState);

  function toggleHelp(k: string) {
    setHelp((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  }

  function submitCare() {
    if (careCity.trim().length < 2) {
      setCareError('Indica al menos la ciudad donde está el animal ahora.');
      return;
    }
    setCareError(null);
    setStep('immediate');
  }

  async function handlePublished(pet: Pet) {
    // If the finder can keep the animal and asked for immediate support, open a need
    // automatically (requester_type=finder). The need uses the CURRENT CARE location
    // (where help is delivered), never the found location. Never block success on it.
    if (canKeep && wantsImmediate && help.length > 0) {
      const labels = help
        .map((k) => FINDER_HELP_OPTIONS.find((o) => o.key === k)?.label)
        .filter(Boolean) as string[];
      const firstCat = FINDER_HELP_OPTIONS.find((o) => o.key === help[0])?.category ?? 'Rescate';
      try {
        await createNeed.mutateAsync({
          city: careLocation || pet.location || 'Sin especificar',
          reference: careReference.trim() || null,
          need: (labels.join(', ') || 'Apoyo para animal rescatado').slice(0, 200),
          category: firstCat,
          quantity: needQuantity.trim() || null,
          urgency: 'medio',
          requester_type: 'finder',
          requester_name: null,
          refuge_id: null,
          whatsapp: pet.phone,
          notes: needNotes.trim() || null,
        });
        setNeedCreated(true);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('[found flow] need creation failed:', err);
      }
    }
    setPublished(pet);
    setStep('done');
  }

  // ---- STEP 5: success ------------------------------------------------------
  if (step === 'done' && published) {
    const shareText = petShareText(published);
    // Match help around where the animal actually is now, not where it was found.
    const matchCity = careLocation || zone || published.location;
    const actions = [
      'Contacta refugios y hogares temporales cercanos',
      'Comparte el reporte para llegar a más gente',
      needCreated ? 'Tu solicitud de insumos ya está publicada' : 'Pide insumos si hacen falta',
      'Revisa los reportes de mascotas perdidas',
    ];
    return (
      <div className="animate-fade">
        <div className="rounded-2xl border border-[#CFE6D6] bg-[#F1F8F3] p-5 text-center">
          <div className="text-4xl" aria-hidden>
            🐾
          </div>
          <h1 className="mt-2 text-[20px] font-extrabold text-forest-dark">¡Tu reporte está activo!</h1>
          <p className="mt-1.5 text-[13px] leading-snug text-[#3A4650]">
            Ya es visible para toda la red. Esto es lo que puedes hacer ahora para aumentar las
            probabilidades de un rescate.
          </p>
        </div>

        <ul className="mt-4 space-y-2">
          {actions.map((a) => (
            <li key={a} className="flex items-start gap-2 text-[13.5px] text-ink">
              <span className="mt-0.5 text-forest" aria-hidden>
                ✓
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Link to="/refugios">
            <Button variant="secondary" fullWidth>
              Ver refugios
            </Button>
          </Link>
          <Link to="/necesidades">
            <Button variant="secondary" fullWidth>
              Ver necesidades
            </Button>
          </Link>
        </div>
        <div className="mt-2.5 grid grid-cols-2 gap-2.5">
          <ShareButton title="Patitas a Salvo" text={shareText} className="w-full" />
          <Link to="/">
            <Button fullWidth>Volver al inicio</Button>
          </Link>
        </div>

        {needCreated && (
          <p className="mt-4 rounded-xl border border-[#D4E7D8] bg-[#EAF3EC] px-3.5 py-3 text-center text-[12.5px] text-forest-dark">
            Publicamos tu solicitud de apoyo en{' '}
            <Link to="/necesidades" className="font-bold underline">
              Necesidades
            </Link>
            {careLocation ? `, con entrega en ${careLocation}.` : '.'}
          </p>
        )}

        <MatchSection
          title="Refugios y hogares que pueden ayudar"
          subtitle={matchCity ? `Cerca de ${matchCity}` : undefined}
          seeAllTo="/refugios"
        >
          <ShelterMatchList city={matchCity} />
        </MatchSection>

        <div className="mt-6 text-center">
          <Link to="/mascotas" className="text-[12.5px] font-bold text-forest">
            Ver todas las mascotas →
          </Link>
        </div>
      </div>
    );
  }

  // ---- STEP (final): publish form -------------------------------------------
  if (step === 'form') {
    const total = canKeep ? 5 : 3;
    return (
      <div className="animate-fade">
        <PageHeading
          title="Publica el reporte"
          subtitle="Una foto clara y el lugar donde la encontraste ayudan a que el rescate avance."
        />
        <StepHint n={total} total={total} />
        <PetForm
          status="found"
          submitLabel="Publicar y activar la red de ayuda"
          defaultLocation={zone}
          onPublished={handlePublished}
        />
        <BackLink onClick={() => setStep(canKeep ? 'immediate' : 'intro')} />
      </div>
    );
  }

  // ---- STEP 2A: can't keep -> shelters first --------------------------------
  if (step === 'shelters') {
    return (
      <div className="animate-fade">
        <PageHeading
          title="Encontremos un lugar seguro"
          subtitle="No te preocupes. Estos refugios y hogares temporales pueden recibir al animal."
        />
        <StepHint n={2} total={3} />
        <Input
          label="¿En qué zona estás?"
          placeholder="Ej: Maiquetía, La Guaira"
          value={zone}
          onChange={(e) => setZone(e.target.value)}
        />
        <div className="mt-4">
          <ShelterMatchList city={zone} />
        </div>
        <Button fullWidth className="mt-5" onClick={() => setStep('form')}>
          Continuar y publicar el reporte
        </Button>
        <p className="mt-2 text-center text-[11.5px] text-faint">
          Publicar el reporte ayuda a que más personas y refugios puedan apoyar.
        </p>
        <BackLink onClick={() => setStep('intro')} />
      </div>
    );
  }

  // ---- STEP 2B: can keep -> what help do you need ---------------------------
  if (step === 'help') {
    return (
      <div className="animate-fade">
        <PageHeading
          title="Podemos ayudarte"
          subtitle="Mientras encontramos a su familia, dinos qué necesitas para cuidarlo."
        />
        <StepHint n={2} total={5} />
        <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Qué ayuda necesitas?</div>
        <div className="flex flex-wrap gap-2">
          {FINDER_HELP_OPTIONS.map((o) => (
            <Chip key={o.key} active={help.includes(o.key)} onClick={() => toggleHelp(o.key)}>
              {o.label}
            </Chip>
          ))}
        </div>
        <Button fullWidth className="mt-6" onClick={() => setStep('care')}>
          Continuar
        </Button>
        <BackLink onClick={() => setStep('intro')} />
      </div>
    );
  }

  // ---- STEP 3: current care location (where help is delivered) ---------------
  if (step === 'care') {
    return (
      <div className="animate-fade">
        <PageHeading
          title="¿Dónde se encuentra actualmente el animal?"
          subtitle="Este es el lugar donde refugios, voluntarios y donantes podrán ayudarte."
        />
        <StepHint n={3} total={5} />
        <div className="space-y-3">
          <Input
            label="Estado"
            placeholder="Ej: Miranda"
            value={careState}
            onChange={(e) => setCareState(e.target.value)}
          />
          <Input
            label="Ciudad"
            placeholder="Ej: Caracas"
            value={careCity}
            onChange={(e) => setCareCity(e.target.value)}
          />
          <Input
            label="Sector / Urbanización"
            placeholder="Ej: Los Palos Grandes"
            value={careSector}
            onChange={(e) => setCareSector(e.target.value)}
          />
          <Input
            label="Referencia / punto de entrega (opcional)"
            placeholder="Ej: 4ta Transversal, frente a la panadería"
            value={careReference}
            onChange={(e) => setCareReference(e.target.value)}
          />
        </div>
        {careError && (
          <p className="mt-3 rounded-xl bg-[#FBE3E1] px-3.5 py-2.5 text-center text-sm font-semibold text-[#C81E1E]">
            {careError}
          </p>
        )}
        <Button fullWidth className="mt-5" onClick={submitCare}>
          Continuar
        </Button>
        <BackLink onClick={() => setStep('help')} />
      </div>
    );
  }

  // ---- STEP 4: immediate support? ------------------------------------------
  if (step === 'immediate') {
    return (
      <div className="animate-fade">
        <PageHeading
          title="¿Necesitas apoyo inmediato?"
          subtitle="Si lo activas, publicamos tu solicitud de ayuda junto al reporte."
        />
        <StepHint n={4} total={5} />
        <div className="space-y-2.5">
          <ChoiceButton
            label="Sí, necesito apoyo ahora"
            description="Publicaremos una solicitud para que te ayuden con lo que marcaste."
            selected={wantsImmediate}
            onClick={() => setWantsImmediate(true)}
          />
          <ChoiceButton
            label="No por ahora"
            description="Solo publico el reporte del animal encontrado."
            selected={!wantsImmediate}
            onClick={() => setWantsImmediate(false)}
          />
        </div>

        {wantsImmediate && (
          <div className="mt-4 space-y-3 rounded-2xl border border-sand-200 bg-[#FBF8F1] p-3.5">
            <p className="text-[12.5px] text-muted">
              Entrega en <span className="font-bold text-forest-dark">{careLocation || 'la ubicación indicada'}</span>.
              Solo dos datos más:
            </p>
            <Input
              label="Cantidad aproximada"
              placeholder="Ej: 5 kg de comida, 1 transportadora"
              value={needQuantity}
              onChange={(e) => setNeedQuantity(e.target.value)}
            />
            <Textarea
              label="Notas (opcional)"
              placeholder="Detalles útiles para quien quiera ayudar"
              value={needNotes}
              onChange={(e) => setNeedNotes(e.target.value)}
            />
          </div>
        )}

        <Button fullWidth className="mt-5" onClick={() => setStep('form')}>
          Continuar y publicar el reporte
        </Button>
        <BackLink onClick={() => setStep('care')} />
      </div>
    );
  }

  // ---- STEP 1: intro --------------------------------------------------------
  return (
    <div className="animate-fade">
      <PageHeading
        title="Encontraste una mascota"
        subtitle="Vamos a ayudarte a conseguirle apoyo, paso a paso."
      />
      <StepHint n={1} total={canKeep ? 5 : 3} />
      <div className="rounded-2xl border border-[#CFE6D6] bg-[#F1F8F3] p-4 text-[13.5px] leading-snug text-[#3A4650]">
        Gracias por ayudar a este animal. Responde una pregunta y te conectamos con la mejor ayuda
        disponible.
      </div>
      <h2 className="mb-3 mt-5 text-[15.5px] font-extrabold text-forest-dark">
        ¿Puedes mantenerla temporalmente?
      </h2>
      <div className="space-y-2.5">
        <ChoiceButton
          label="Sí, puedo cuidarla por ahora"
          description="Te ayudamos con alimento, veterinario, insumos y más."
          onClick={() => {
            setCanKeep(true);
            setStep('help');
          }}
        />
        <ChoiceButton
          label="No puedo quedármela"
          description="Te mostramos refugios y hogares temporales que pueden recibirla."
          tone="ember"
          onClick={() => {
            setCanKeep(false);
            setStep('shelters');
          }}
        />
      </div>
    </div>
  );
}
