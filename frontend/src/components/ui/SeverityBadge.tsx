import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical' | 'normal' | 'suspicious' | 'malicious';

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
  const n = (level || 'low').toLowerCase();

  let severityClass = 'severity-low';
  let text = label || 'LOW';

  if (n === 'critical') {
    severityClass = 'severity-critical';
    text = label || 'CRITICAL';
  } else if (n === 'high' || n === 'malicious') {
    severityClass = 'severity-high';
    text = label || (n === 'malicious' ? 'MALICIOUS' : 'HIGH');
  } else if (n === 'medium' || n === 'warning' || n === 'suspicious') {
    severityClass = 'severity-medium';
    text = label || (n === 'suspicious' ? 'SUSPICIOUS' : 'MEDIUM');
  } else {
    severityClass = 'severity-low';
    text = label || (n === 'normal' ? 'NORMAL' : 'LOW');
  }

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wider uppercase font-mono',
          severityClass,
          className
        )
      )}
    >
      {showDot && <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-current" />}
      <span>{text}</span>
    </span>
  );
};

export default SeverityBadge;
