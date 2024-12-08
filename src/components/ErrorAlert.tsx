import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { ErrorState } from '../types/common';

interface ErrorAlertProps {
  error: ErrorState;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorAlert({ error, onDismiss, className = '' }: ErrorAlertProps) {
  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-700">{error.message}</p>
          {error.code && (
            <p className="mt-1 text-xs text-red-600">
              Error code: {error.code}
              {error.details && typeof error.details === 'string' && (
                <span className="ml-1">- {error.details}</span>
              )}
            </p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-auto flex-shrink-0 text-red-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            aria-label="Dismiss error"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}