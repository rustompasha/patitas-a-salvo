import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeading } from './PageHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { useToast } from '@/components/ui/Toast';
import { normalizeVePhone } from '@/lib/utils';
import { CENTRO_RECEIVE_OPTIONS } from '@/constants/help';
import { useCreateCentroAcopio } from '@/features/help/hooks';

export function ReportCentroAcopioPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const create = useCreateCentroAcopio();

  const [name, setName] = useState('');
  const [contactName, setContactName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [receives, setReceives] = useState<string[]>([]);
  const [mapsUrl, setMapsUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  function toggleReceive(v: string) {
    setReceives((p) => (p.includes(v) ? p.filter((x) => x !== v) : [...p, v]));
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
        type: 'centro_acopio',
        city: city.trim(),
        address: address.trim() || null,
        whatsapp: whatsapp.trim() || null,
        needs: receives,
        notes: description.trim() || null,
        contact_name: contactName.trim() || null,
        maps_url: mapsUrl.trim() || null,
      },
      {
        onSuccess: () => {
          toast('Centro de acopio registrado');
          navigate('/centros-acopio');
        },
        onError: (err) => {
          // eslint-disable-next-line no-console
          console.error('[centro submit] insert failed:', err);
          setError('No pudimos registrar el centro. Revisa los datos e inténtalo otra vez.');
        },
      },
    );
  }

  return (
    <div className="animate-fade">
      <PageHeading
        title="📦 Registrar centro de acopio"
        subtitle="Un punto que recibe y distribuye alimento, medicinas e insumos para animales."
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del centro"
          placeholder="Ej: Centro de Acopio La Guaira"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Responsable"
          placeholder="Nombre de quien coordina (opcional)"
          value={contactName}
          onChange={(e) => setContactName(e.target.value)}
        />
        <Input label="WhatsApp" placeholder="0412…" inputMode="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
        <Input label="Ciudad / zona" placeholder="Ej: Caraballeda, La Guaira" value={city} onChange={(e) => setCity(e.target.value)} />
        <Input label="Dirección o referencia" placeholder="Ej: Av. La Playa, sector Los Corales" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Textarea
          label="Descripción"
          placeholder="Horarios, qué necesitan con prioridad, cómo recibir donaciones…"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <div className="mb-2 text-[12.5px] font-bold text-[#3A4650]">¿Qué reciben?</div>
          <div className="flex flex-wrap gap-2">
            {CENTRO_RECEIVE_OPTIONS.map((r) => (
              <Chip key={r} active={receives.includes(r)} onClick={() => toggleReceive(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </div>

        <Input
          label="Link de Google Maps (opcional)"
          placeholder="https://maps.google.com/…"
          inputMode="url"
          value={mapsUrl}
          onChange={(e) => setMapsUrl(e.target.value)}
        />

        {error && (
          <p className="rounded-xl bg-[#FBE3E1] px-3.5 py-2.5 text-center text-sm font-semibold text-[#C81E1E]">
            {error}
          </p>
        )}

        <Button type="submit" fullWidth loading={create.isPending}>
          Registrar centro de acopio
        </Button>
        <p className="text-center text-[11px] leading-relaxed text-faint">
          El centro aparecerá públicamente para que las personas lleven donaciones y te contacten por WhatsApp.
        </p>
      </form>
    </div>
  );
}
