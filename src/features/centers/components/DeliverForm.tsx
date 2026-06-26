import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { CenterNeed } from '@/types/center';

export interface DeliverPayload {
  item: string;
  qty: string;
  name: string;
}

export function DeliverForm({
  needs,
  onSubmit,
  onCancel,
}: {
  needs: CenterNeed[];
  onSubmit: (payload: DeliverPayload) => void;
  onCancel: () => void;
}) {
  const options = [...needs.map((n) => ({ value: n.name, label: n.name })), { value: 'Otro', label: 'Otro' }];
  const [item, setItem] = useState(options[0]?.value ?? 'Otro');
  const [qty, setQty] = useState('');
  const [name, setName] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ item, qty: qty.trim(), name: name.trim() });
      }}
      className="mt-3 space-y-3 rounded-2xl border border-sand-200 bg-white p-4"
    >
      <div className="text-[13px] font-bold text-forest-dark">Registra tu entrega</div>

      <Select
        label="¿Qué entregaste?"
        options={options}
        value={item}
        onChange={(e) => setItem(e.target.value)}
      />
      <Input
        label="Cantidad"
        placeholder="Ej: 10 kg, 3 unidades, 24 botellas…"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />
      <Input
        label="Tu nombre (opcional)"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="flex gap-2">
        <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="flex-1">
          Registrar entrega
        </Button>
      </div>
    </form>
  );
}
