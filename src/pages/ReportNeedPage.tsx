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
import { NEED_CATEGORY_OPTIONS, REQUESTER_TYPE_OPTIONS, URGENCY_OPTIONS } from '@/constants/help';
import { useCreateNeedReport } from '@/features/help/hooks';
import type { UrgencyLevel } from '@/types/help';

export function ReportNeedPage() {
  const { toast } = useToast();
  const create = useCreateNeedReport();
  const [submitted, setSubmitted] = useState(false);

  const [requesterType, setRequesterType] = useState('individual');
  const [requesterName, setRequesterName] = useState('');
  const [city, setCity] = useState('');
  const [reference, setReference] = useState('');
  const [need, setNeed] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medio');
  const [whatsapp, setWhatsapp] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const isOrg = requesterType !== 'individual';

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (city.trim().length < 2 || need.trim().length < 2 || !normalizeVePhone(whatsapp)) {
      setError('Completa ciudad, necesidad principal y un WhatsApp válido.');
      return;
    }
    if (isOrg && requesterName.trim().length < 2) {
      setError(requesterType === 'veterinaria' ? 'Indica el nombre de la clínica.' : 'Indica el nombre del refugio.');
      return;
    }
    setError(null);
    create.mutate(
      {
        city: city.trim(),
        reference: reference.trim() || null,
        need: need.trim(),
        category: category || null,
        quantity: quantity.trim() || null,
        urgency,
        requester_type: requesterType,
        requester_name: isOrg ? requesterName.trim() : null,
        whatsapp: whatsapp.trim() || null,
        notes: notes.trim() || null,
      },
      {
        onSuccess: () => {
          setSubmitted(true);
          toast('Necesidad reportada');
        },
        onError: () => toast('No se pudo enviar. Inténtalo de nuevo.'),
      },
    );
  }

  if (submitted) {
    return (
      <div className="animate-fade">
        <PageHeading title="Reportar necesidad" />
        <SubmittedNotice
          title="Necesidad publicada"
          message="Tu necesidad ya está publicada y visible para quienes quieran ayudar."
        >
          <Link to="/necesidades">
            <Button fullWidth>Ver necesidades</Button>
          </Link>
          <Button variant="secondary" fullWidth onClick={() => setSubmitted(false)}>
            Reportar otra
          </Button>
        </SubmittedNotice>
      </div>
    );
  }

  return (
    <div className="animate-fade">
      <PageHeading title="Reportar necesidad" subtitle="Avisa qué hace falta y dónde. Se publica de inmediato para que puedan ayudarte." />
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Quién solicita?</div>
          <div className="flex flex-col gap-2">
            {REQUESTER_TYPE_OPTIONS.map((r) => (
              <Chip
                key={r.value}
                active={requesterType === r.value}
                onClick={() => setRequesterType(r.value)}
                className="text-left"
              >
                {r.label}
              </Chip>
            ))}
          </div>
        </div>

        {isOrg && (
          <Input
            label={requesterType === 'veterinaria' ? 'Nombre de la clínica' : 'Nombre del refugio / organización'}
            placeholder={requesterType === 'veterinaria' ? 'Ej: Clínica Veterinaria Macuto' : 'Ej: Refugio Patitas'}
            value={requesterName}
            onChange={(e) => setRequesterName(e.target.value)}
          />
        )}

        <Input label="Ciudad / sector" placeholder="Ej: Maiquetía, La Guaira" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="Centro o punto de referencia" placeholder="Ej: Plaza de Macuto (opcional)" value={reference} onChange={(e) => setReference(e.target.value)} />
        <Input label="Necesidad principal" placeholder="Ej: Perrarina, transportadoras, suero" value={need} onChange={(e) => setNeed(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Tipo de ayuda necesaria</div>
          <div className="flex flex-wrap gap-2">
            {NEED_CATEGORY_OPTIONS.map((c) => (
              <Chip key={c} active={category === c} onClick={() => setCategory(category === c ? '' : c)}>
                {c}
              </Chip>
            ))}
          </div>
        </div>

        <Input label="Cantidad aproximada" placeholder="Ej: 50 kg, 10 unidades" value={quantity} onChange={(e) => setQuantity(e.target.value)} />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">Urgencia</div>
          <div className="flex gap-2">
            {URGENCY_OPTIONS.map((u) => (
              <Chip key={u.value} active={urgency === u.value} onClick={() => setUrgency(u.value)} className="flex-1">
                {u.label}
              </Chip>
            ))}
          </div>
        </div>

        <Input
          label={
            requesterType === 'veterinaria'
              ? 'WhatsApp de la clínica'
              : requesterType === 'refugio'
                ? 'WhatsApp del refugio'
                : 'WhatsApp de contacto'
          }
          placeholder="0412…"
          inputMode="tel"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
        />
        <Textarea label="Notas" placeholder="Detalles útiles para quien quiera ayudar" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {error && <p className="text-center text-sm font-medium text-lost">{error}</p>}
        {create.isError && (
          <p className="text-center text-sm font-medium text-lost">
            Ocurrió un error al enviar. Revisa tu conexión e inténtalo de nuevo.
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Reportar necesidad
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          Tu necesidad aparece públicamente de inmediato. Comparte solo información real.
        </p>
      </form>
    </div>
  );
}
