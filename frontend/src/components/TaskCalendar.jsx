import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AlertTriangle, CheckCircle } from 'lucide-react';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

const EventComponent = ({ event }) => {
  const isCompleted = event.resource.status === 'Completed';
  const isOverdue = !isCompleted && new Date(event.resource.deadline) < new Date();

  return (
    <div className={`calendar-event ${isCompleted ? 'event-done' : isOverdue ? 'event-overdue' : ''}`}>
      <span className="event-title">{event.title}</span>
      {isCompleted && <CheckCircle size={10} className="event-icon" />}
      {isOverdue && <AlertTriangle size={10} className="event-icon" />}
    </div>
  );
};

const TaskCalendar = ({ tasks, onSelectTask }) => {
  // Process tasks with a valid deadline into standard calendar events
  const events = tasks
    .filter(t => t.deadline)
    .map(task => {
      const date = new Date(task.deadline);
      return {
        id: task._id,
        title: task.title,
        start: date,
        end: date,
        allDay: true, // tasks represent entire day deadline visually
        resource: task
      };
    });

  return (
    <div className="task-calendar-wrapper glass-panel">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        onSelectEvent={(e) => onSelectTask(e.resource)}
        components={{
          event: EventComponent
        }}
        popup
        views={['month', 'week', 'day']}
      />
    </div>
  );
};

export default TaskCalendar;
