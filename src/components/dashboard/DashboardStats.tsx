import React from 'react';
import { Clock, FileText, Calendar } from 'lucide-react';
import { useMeetingStore } from '../../store/meetingStore';

export function DashboardStats() {
  const { meetings } = useMeetingStore();

  const stats = {
    completed: meetings.filter(m => m.status === 'completed').length,
    active: meetings.filter(m => m.status === 'active').length,
    total: meetings.length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-orange-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Clock className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Recent Activity</h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
        <p className="text-sm text-gray-600">Completed Meetings</p>
      </div>
      
      <div className="bg-orange-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <FileText className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Active</h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
        <p className="text-sm text-gray-600">Ongoing Meetings</p>
      </div>

      <div className="bg-orange-50 p-6 rounded-lg">
        <div className="flex items-center mb-4">
          <Calendar className="h-6 w-6 text-orange-500 mr-2" />
          <h2 className="text-lg font-semibold">Total</h2>
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        <p className="text-sm text-gray-600">All Meetings</p>
      </div>
    </div>
  );
}