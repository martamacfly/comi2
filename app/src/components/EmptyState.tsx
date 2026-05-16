import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@phosphor-icons/react';

interface EmptyStateProps {
  icon: ComponentType<IconProps>;
  iconTone?: 'sage' | 'peach' | 'lavender' | 'sky';
  children: ReactNode;
}

export function EmptyState({
  icon: Icon,
  iconTone = 'sage',
  children,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <Icon
        size={56}
        weight="duotone"
        className={`empty-state__icon empty-state__icon--${iconTone}`}
        aria-hidden
      />
      {children}
    </div>
  );
}
