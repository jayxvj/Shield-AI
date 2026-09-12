import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'normal' | 'suspicious' | 'malicious';

export interface SeverityBadgeProps {
  level: SeverityLevel | string;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  level,
  label,
  className,
  showDot = true,
}) => {
  const normalizedLevel = (level || 'low').toLowerCase();

  let text = label;
  let bgClass = 'bg-[#9EABA2]/20';
  let textClass = 'text-[#5F6F65] dark:text-[#BDD1C5]';
  let dotClass = 'bg-[#9EABA2] dark:bg-[#BDD1C5]';
  let borderClass = 'border-[#9EABA2]/30';

  if (normalizedLevel === 'high' || normalizedLevel === 'critical' || normalizedLevel === 'malicious') {
    text = text || (normalizedLevel === 'malicious' ? 'Malicious' : 'HIGH');
    bgClass = 'bg-[#A36361]/20';
    textClass = 'text-[#A36361]';
    dotClass = 'bg-[#A36361]';
    borderClass = 'border-[#A36361]/30';
  } else if (normalizedLevel === 'medium' || normalizedLevel === 'warning' || normalizedLevel === 'suspicious') {
    text = text || (normalizedLevel === 'suspicious' ? 'Suspicious' : 'MEDIUM');
    bgClass = 'bg-[#E8B298]/20';
    textClass = 'text-[#C47B5E] dark:text-[#E8B298]';
    dotClass = 'bg-[#E8B298]';
    borderClass = 'border-[#E8B298]/30';
  } else {
    // low / safe / normal
    text = text || (normalizedLevel === 'normal' ? 'Normal' : 'LOW');
    bgClass = 'bg-[#9EABA2]/20';
    textClass = 'text-[#5F6F65] dark:text-[#BDD1C5]';
    dotClass = 'bg-[#9EABA2] dark:bg-[#BDD1C5]';
    borderClass = 'border-[#9EABA2]/30';
  }

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase',
          bgClass,
          textClass,
          borderClass,
          className
        )
      )}
    >
      {showDot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotClass)} />}
      <span>{text}</span>
    </span>
  );
};

export default SeverityBadge;
