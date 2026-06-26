import { useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { SubmittedNotice } from '@/components/ui/SubmittedNotice';
import { SearchBar } from '@/features/pets/components/SearchBar';
import { FosterOfferCard } from '@/features/help/components/FosterOfferCard';
import { useCreateFosterOffer, useVerifiedFosterOffers } from '@/features/help/hooks';
import { useToast } from '@/components/ui/Toast';
import { normalizeVePhone } from '@/lib/utils';
import { ACCEPTS_OPTIONS, CAPACITY_OPTIONS, TIME_OPTIONS } from '@/constants/help';

export function FosterPage() {
  const { toast } = useToast();
  const create = useCreateFosterOffer();
  const offers = useVerifiedFosterOffers();
  const formRef = useRef<HTMLFormElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [accepts, setAccepts] = useState<string[]>([]);
  const [capacity, setCapacity] = useState('1');
  const [time, setTime] = useState('24h');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const list = offers.data ?? [];
    if (!q) return list;
    return list.filter((o) => `${o.name} ${o.city}`.toLowerCase().includes(q));
  }, [offers.data, search]);

  function toggleAccept(v: string) {
    setAccepts((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));
  }

  function resetForm() {
    setName('');
    setCity('');
    setWhatsapp('');
    setAccepts([]);
    setCapacity('1');
    setTime('24h');
    setNotes('');
    setSubmitted(false);
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
        city: city.trim(),
        whatsapp: whatsapp.trim(),
        accepts,
        capacity,
        availability: time,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Hogar temporal registrado');
        },
        onError: () => toast('No se pudo enviar. Inténtalo de nuevo.'),
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Puedo ser hogar temporal" />
        <SubmittedNotice
          title="¡Gracias por abrir tu casa!"
          message="Tu oferta ya está publicada y visible. Las personas que necesiten un hogar temporal te contactarán directamente por WhatsApp."
        >
          <Button fullWidth onClick={resetForm}>
            Ofrecer otro hogar
          </Button>
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
        title="Puedo ser hogar temporal"
        subtitle="Ofrece un hogar temporal para una mascota mientras aparece su familia o un refugio."
      />

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nombre" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Ciudad / zona" placeholder="Ej: Caraballeda, La Guaira" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Qué puede recibir?</div>
          <div className="flex flex-wrap gap-2">
            {ACCEPTS_OPTIONS.map((a) => (
              <Chip key={a} active={accepts.includes(a)} onClick={() => toggleAccept(a)}>
                {a}
              </Chip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Capacidad</div>
            <div className="flex gap-2">
              {CAPACITY_OPTIONS.map((c) => (
                <Chip key={c} active={capacity === c} onClick={() => setCapacity(c)} className="flex-1">
                  {c}
                </Chip>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Tiempo disponible</div>
            <div className="flex flex-wrap gap-1.5">
              {TIME_OPTIONS.map((t) => (
                <Chip key={t} active={time === t} onClick={() => setTime(t)}>
                  {t}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <Textarea label="Requisitos / notas" placeholder="Ej: Necesito apoyo de alimento, no tengo transporte…" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <p className="text-center text-sm font-medium text-lost">{error}</p>}
        {create.isError && (
          <p className="text-center text-sm font-medium text-lost">
            Ocurrió un error al enviar. Revisa tu conexión e inténtalo de nuevo.
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Ofrecer mi hogar
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu oferta aparece públicamente. Las personas te contactarán directamente por WhatsApp.
        </p>
      </form>

      <section className="mt-7">
        <h2 className="mb-3 text-[16px] font-extrabold text-forest-dark">Hogares temporales disponibles</h2>

        {offers.isLoading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-6 w-6 text-forest" />
          </div>
        ) : offers.isError ? (
          <ErrorState onRetry={offers.refetch} />
        ) : (offers.data?.length ?? 0) === 0 ? (
          <EmptyState
            emoji="🏠"
            title="Todavía no hay hogares temporales publicados"
            message="Cuando alguien ofrezca un hogar temporal, aparecerá aquí."
            action={
              <Button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                Ofrecer mi hogar
              </Button>
            }
          />
        ) : (
          <>
            <SearchBar value={search} onChange={setSearch} placeholder="Buscar por nombre o ciudad…" />
            <div className="mt-3 flex flex-col gap-3">
              {filtered.map((o) => (
                <FosterOfferCard key={o.id} offer={o} />
              ))}
              {filtered.length === 0 && (
                <p className="py-4 text-center text-[13px] text-muted">Sin resultados para “{search}”.</p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
