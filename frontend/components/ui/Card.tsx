import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hoverable = false, 
  ...props 
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-white dark:bg-[#1A1F2B] border border-gray-200 dark:border-white/5 rounded-[12px] p-5 text-gray-900 dark:text-white shadow-cardLight dark:shadow-card transition-all duration-200',
          hoverable && 'hover:border-gray-300 dark:hover:border-white/15 hover:bg-gray-50 dark:hover:bg-[#222938]',
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
