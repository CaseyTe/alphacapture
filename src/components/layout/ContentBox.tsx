import React, { ReactNode } from 'react';

interface ContentBoxProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export const ContentBox: React.FC<ContentBoxProps> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
};