import React from 'react';
import { Calendar, Clock, Video, Timer, MapPin } from 'lucide-react';
import { Course } from '@prisma/client';

interface EventDetailsProps {
  course: Course;
}

export const EventDetails: React.FC<EventDetailsProps> = ({ course }) => {

  if (!course.startDate) return null;

  const dateObj = new Date(course.startDate);

  const dateStr = dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate end time (assuming 4 hours duration)
  // TODO: Add duration field to Course model if dynamic duration is needed
  const durationHours = 4;
  const endDateObj = new Date(dateObj.getTime() + durationHours * 60 * 60 * 1000);

  const startTimeStr = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const endTimeStr = endDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const timeRangeStr = `${startTimeStr} - ${endTimeStr}`;

  // Default details (Unified/Old view)
  let details = [
    {
      icon: Timer,
      label: "1 Day",
      color: "text-blue-600"
    },
    {
      icon: Video,
      label: "Live Session",
      color: "text-blue-600"
    },
    {
      icon: Calendar,
      label: dateStr,
      color: "text-blue-600"
    },
    {
      icon: Clock,
      label: timeRangeStr,
      color: "text-blue-600"
    }
  ];

  // If LIVE, we show the specific requested fields
  if (course.type === 'LIVE') {
    details = [
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
      {
        icon: Timer,
        label: `${durationHours} Hours`,
        color: "text-blue-600"
      },
      {
        icon: MapPin,
        label: "Online - Live Session",
        color: "text-blue-600"
      }
    ];
  }

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