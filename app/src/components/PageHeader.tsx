import type { ComponentType, ReactNode } from 'react';
import type { IconProps } from '@phosphor-icons/react';

interface PageHeaderProps {
  title: string;
  lead?: string;
  icon: ComponentType<IconProps>;
  iconTone?: 'sage' | 'peach' | 'lavender' | 'sky';
  children?: ReactNode;
}

export function PageHeader({
  title,
  lead,
  icon: Icon,
  iconTone = 'sage',
  children,
}: PageHeaderProps) {
  return (
    <div className="page__head">
      <div className="page__head-text">
        <h1 className="page__title">
          <Icon
            size={32}
            weight="duotone"
            className={`page__title-icon page__title-icon--${iconTone}`}
            aria-hidden
          />
          {title}
        </h1>
        {lead && <p className="page__lead">{lead}</p>}
      </div>
      {children}
    </div>
  );
}
