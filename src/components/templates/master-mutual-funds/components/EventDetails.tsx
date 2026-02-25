import React from 'react';
import { Calendar, Clock, Video, Timer, MapPin } from 'lucide-react';
import { Course } from '@prisma/client';

interface EventDetailsProps {
  course: Course;
}

const formatLabel = (type: string) => {
  if (type === 'LIVE') return 'Online - Live Session';
  if (type === 'HYBRID') return 'Live + Recorded';
  return 'Recorded Session';
};

export const EventDetails: React.FC<EventDetailsProps> = ({ course }) => {

  if (!course.startDate) return null;

  const dateObj = new Date(course.startDate);

  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const startTimeStr = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const isLiveOrHybrid = course.type === 'LIVE' || course.type === 'HYBRID';

  // Build details array dynamically from course data
  const details = [
    {
      icon: Calendar,
      label: dateStr,
      color: "text-blue-600"
    },
    {
      icon: Clock,
      label: `Start: ${startTimeStr}`,
      color: "text-blue-600"
    },
    // Show duration only for LIVE or HYBRID sessions
    ...(isLiveOrHybrid ? [{
      icon: Timer,
      label: course.duration || '4 Hours',
      color: "text-blue-600"
    }] : []),
    {
      icon: course.type === 'LIVE' || course.type === 'HYBRID' ? MapPin : Video,
      label: formatLabel(course.type),
      color: "text-blue-600"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {details.map((item, index) => (
          <div key={index} className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
            <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
            <span className="text-gray-800 font-medium text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}