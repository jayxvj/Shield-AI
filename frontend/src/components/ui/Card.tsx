import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverable = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'glass-card rounded-xl p-5 text-[--text-primary] transition-all duration-200',
          hoverable && 'cursor-pointer hover:-translate-y-0.5',
          glow && 'animate-glow-pulse',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
