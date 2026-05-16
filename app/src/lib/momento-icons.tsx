import { ForkKnife, Moon, Sun } from '@phosphor-icons/react';
import type { MomentoPlato, MomentoSlot } from '../db/types';
import type { ComponentType } from 'react';
import type { IconProps } from '@phosphor-icons/react';

export function MomentoSlotIcon({
  momento,
  size = 16,
}: {
  momento: MomentoSlot;
  size?: number;
}) {
  const Icon = momento === 'comida' ? Sun : Moon;
  return (
    <Icon
      size={size}
      weight="duotone"
      className={`momento-icon momento-icon--${momento}`}
      aria-hidden
    />
  );
}

export const MOMENTO_PLATO_ICON: Record<
  MomentoPlato,
  ComponentType<IconProps>
> = {
  comida: Sun,
  cena: Moon,
  ambos: ForkKnife,
};
