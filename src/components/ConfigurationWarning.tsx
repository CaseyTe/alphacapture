import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { env } from '../config/env';

export const ConfigurationWarning: React.FC = () => {
  const missingConfigs = {
    supabase: !env.VITE_SUPABASE_URL || !env.VITE_SUPABASE_ANON_KEY,
    openai: !env.VITE_OPENAI_API_KEY,
    aws: !env.VITE_AWS_REGION || !env.VITE_AWS_ACCESS_KEY_ID || !env.VITE_AWS_SECRET_ACCESS_KEY,
  };

  if (!missingConfigs.supabase && !missingConfigs.openai && !missingConfigs.aws) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex items-start">
        <AlertTriangle className="h-6 w-6 text-yellow-400 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-medium text-yellow-800">
            Configuration Warning
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p className="mb-2">
              Some features may be unavailable due to missing configuration:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {missingConfigs.supabase && (
                <li>Supabase (transcript storage and search)</li>
              )}
              {missingConfigs.openai && (
                <li>OpenAI (transcript analysis and embeddings)</li>
              )}
              {missingConfigs.aws && (
                <li>AWS (real-time transcription)</li>
              )}
            </ul>
            <p className="mt-2">
              Please check your environment variables configuration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};