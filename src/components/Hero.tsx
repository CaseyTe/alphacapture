import React from 'react';
import { Wand2, Sparkles, Zap } from 'lucide-react';

export function Hero() {
  return (
    <div className="pt-20 pb-16 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Meetings into
            <span className="text-orange-500"> Actionable Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Automatically transcribe, summarize, and extract key points from your meetings
            with cutting-edge AI technology.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center">
              <Wand2 className="mr-2 h-5 w-5" />
              Try for Free
            </button>
            <button className="border-2 border-orange-500 text-orange-500 px-8 py-3 rounded-lg hover:bg-orange-50 transition-colors">
              Watch Demo
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">99.9% Accuracy</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">Real-time Processing</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <span className="text-gray-700">Enterprise Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}