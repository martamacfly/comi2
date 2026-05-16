import type { MomentoPlato } from '../db/types';
import { MOMENTO_PLATO_ICON } from '../lib/momento-icons';

const MOMENTO_LABEL: Record<MomentoPlato, string> = {
  comida: 'Comida',
  cena: 'Cena',
  ambos: 'Comida y cena',
};

const MOMENTO_BADGE: Record<MomentoPlato, string> = {
  comida: 'badge',
  cena: 'badge badge--cena',
  ambos: 'badge badge--ambos',
};

export function MomentoBadge({ momento }: { momento: MomentoPlato }) {
  const Icon = MOMENTO_PLATO_ICON[momento];
  return (
    <span className={`${MOMENTO_BADGE[momento]} badge--with-icon`}>
      <Icon size={14} weight="duotone" aria-hidden />
      {MOMENTO_LABEL[momento]}
    </span>
  );
}
