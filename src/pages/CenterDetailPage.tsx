import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToast } from '@/components/ui/Toast';
import { WhatsAppButton } from '@/components/contact/WhatsAppButton';
import { DirectionsButton } from '@/components/contact/DirectionsButton';
import { ShareButton } from '@/components/contact/ShareButton';
import { DeliverForm, type DeliverPayload } from '@/features/centers/components/DeliverForm';
import { getCenterById, CENTER_STATUS_META, URGENCY_META } from '@/constants/centers';
import type { CenterDelivery, CenterNeed } from '@/types/center';

export function CenterDetailPage() {
  const { id } = useParams<{ id: string }>();
  const center = getCenterById(id);
  const { toast } = useToast();

  const [needs, setNeeds] = useState<CenterNeed[]>(center ? center.needs : []);
  const [received, setReceived] = useState<CenterDelivery[]>(center ? center.received : []);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!center) {
    return (
      <div className="animate-fade">
        <PageHeading title="Centro" />
        <EmptyState
          emoji="🏥"
          title="Centro no encontrado"
          message="Este punto no existe o fue retirado."
          action={
            <Link to="/centros">
              <Button>Ver centros activos</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const status = CENTER_STATUS_META[center.status];
  const needsLine = needs.map((n) => n.name).join(', ');
  const shareText = `🏥 ${center.name} (${center.location}) necesita: ${needsLine}. Ayuda en Patitas a Salvo:`;

  function handleDeliver(payload: DeliverPayload) {
    const label = payload.qty ? `${payload.qty} · ${payload.item}` : payload.item;
    const who = payload.name ? ` (${payload.name})` : '';
    setReceived((prev) => [{ txt: label + who, t: 'ahora' }, ...prev].slice(0, 6));

    // Visually advance progress / ease urgency for the matching need.
    setNeeds((prev) =>
      prev.map((n) => {
        if (n.name !== payload.item) return n;
        const add = parseInt(payload.qty, 10) || Math.max(1, Math.round(n.need * 0.1));
        const got = Math.min(n.need, n.got + add);
        const urgency = got >= n.need ? 'Medio' : n.urgency;
        return { ...n, got, urgency };
      }),
    );

    setShowForm(false);
    setSuccess('Gracias. Tu entrega ayuda a actualizar las necesidades del centro.');
    toast('Entrega registrada');
  }

  return (
    <div className="animate-fade">
      <PageHeading title={center.name} />

      {/* status + trust */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-extrabold ${status.badge}`}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: status.dot }} />
          {center.status}
        </span>
        <span className="text-[12px] text-muted">{center.type}</span>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[12px] font-bold text-[#1F7A6D]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l8 4v5c0 5-3.4 8.5-8 11-4.6-2.5-8-6-8-11V6l8-4z" stroke="#1F7A6D" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M9 12l2 2 4-4" stroke="#1F7A6D" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {center.trust} · actualizado {center.updated}
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[12.5px] text-[#5C6670]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M12 21s-6-5-6-10a6 6 0 1112 0c0 5-6 10-6 10z" stroke="#9AA3AD" strokeWidth="1.7" />
        </svg>
        {center.address}
      </div>

      {/* contact actions */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        <WhatsAppButton phone={center.whatsapp} message={shareText} compact className="w-full" />
        <DirectionsButton query={center.address || center.location} compact className="w-full" />
        <ShareButton title={center.name} text={shareText} compact className="w-full" />
      </div>

      {/* capacity */}
      <div className="mt-4 rounded-2xl border border-sand-200 bg-white p-3.5">
        <div className="flex justify-between text-[12.5px] font-bold text-ink">
          <span>Capacidad de recepción</span>
          <span>{center.capacityPct}%</span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#EFE7D6]">
          <div className="h-full rounded-full bg-[#2A9D8F]" style={{ width: `${center.capacityPct}%` }} />
        </div>
        <div className="mt-2 text-[12px] text-muted">
          Cupo temporal para mascotas: <strong className="text-ink">{center.slots}</strong>
        </div>
      </div>

      {/* needs */}
      <h2 className="mt-5 text-[15px] font-extrabold text-forest-dark">Necesitan ahora</h2>
      <div className="mt-2.5 flex flex-col gap-2.5">
        {needs.map((n) => {
          const meta = URGENCY_META[n.urgency];
          const pct = Math.round((n.got / n.need) * 100);
          return (
            <div key={n.name} className="rounded-2xl border border-sand-200 bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[13.5px] font-bold text-ink">{n.name}</span>
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase ${meta.badge}`}>
                  {n.urgency}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#EFE7D6]">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.bar }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[11.5px] font-semibold text-muted">
                <span>Faltan {Math.max(0, n.need - n.got)} {n.unit}</span>
                <span>Recibidos {n.got} de {n.need} {n.unit}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* recently received */}
      <h2 className="mt-5 text-[15px] font-extrabold text-forest-dark">Entregas recientes</h2>
      <div className="mt-2.5 flex flex-col gap-2">
        {received.map((d, i) => (
          <div key={i} className="flex items-center gap-2.5 rounded-xl border border-sand-200 bg-white px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#EAF3EC]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l4 4 10-10" stroke="#1F4D3A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <span className="flex-1 text-[12.5px] font-semibold text-ink">{d.txt}</span>
            <span className="text-[11px] font-semibold text-faint">{d.t}</span>
          </div>
        ))}
      </div>

      {/* QR placeholder */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl bg-forest p-4">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
          <svg width="56" height="56" viewBox="0 0 60 60" shapeRendering="crispEdges">
            <rect width="60" height="60" fill="#fff" />
            <g fill="#1F4D3A">
              <rect x="4" y="4" width="16" height="16" /><rect x="8" y="8" width="8" height="8" fill="#fff" />
              <rect x="40" y="4" width="16" height="16" /><rect x="44" y="8" width="8" height="8" fill="#fff" />
              <rect x="4" y="40" width="16" height="16" /><rect x="8" y="44" width="8" height="8" fill="#fff" />
              <rect x="26" y="4" width="4" height="4" /><rect x="26" y="12" width="4" height="8" />
              <rect x="34" y="26" width="4" height="4" /><rect x="26" y="26" width="4" height="4" />
              <rect x="42" y="26" width="8" height="4" /><rect x="26" y="42" width="4" height="8" />
              <rect x="34" y="44" width="4" height="4" /><rect x="42" y="42" width="4" height="4" />
            </g>
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold leading-tight text-white">
            Escanea este QR en el punto para registrar tu entrega
          </div>
          <div className="mt-1 text-[11.5px] text-[#A9C6B5]">
            Próximamente · por ahora registra tu entrega abajo.
          </div>
        </div>
      </div>

      {/* deliver flow */}
      {success && (
        <div className="mt-4 rounded-2xl border border-[#D4E7D8] bg-[#EAF3EC] px-4 py-3 text-[13px] font-semibold text-forest">
          {success}
        </div>
      )}

      {showForm ? (
        <DeliverForm needs={needs} onSubmit={handleDeliver} onCancel={() => setShowForm(false)} />
      ) : (
        <Button
          variant="primary"
          fullWidth
          className="mt-4 !py-4 !text-[15.5px]"
          onClick={() => {
            setSuccess(null);
            setShowForm(true);
          }}
        >
          Acabo de entregar
        </Button>
      )}

      <div className="mt-6 text-center">
        <Link to="/centros" className="text-[12.5px] font-bold text-forest">
          ← Ver todos los centros
        </Link>
      </div>
    </div>
  );
}
