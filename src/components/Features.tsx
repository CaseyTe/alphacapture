import React from 'react';
import { Brain, Lock, Globe, Sparkles } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Brain className="h-8 w-8 text-orange-500" />,
      title: "AI-Powered Transcription",
      description: "State-of-the-art speech recognition with support for multiple languages and speakers."
    },
    {
      icon: <Lock className="h-8 w-8 text-orange-500" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and compliance with major security standards."
    },
    {
      icon: <Globe className="h-8 w-8 text-orange-500" />,
      title: "Global Accessibility",
      description: "Access your transcripts from anywhere, on any device, at any time."
    },
    {
      icon: <Sparkles className="h-8 w-8 text-orange-500" />,
      title: "Smart Summaries",
      description: "Automatically generate meeting summaries and action items."
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Everything you need to capture, understand, and act on your meeting insights.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}