import { useMemo } from 'react';
import type { Task } from '@/types';

interface ActivityHeatmapProps {
  tasks: Task[];
  color: string;
}

// Generate last 52 weeks of dates (like GitHub)
function generateDateGrid(): Date[][] {
  const weeks: Date[][] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Start from 52 weeks ago, on a Sunday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 364); // Go back ~52 weeks
  // Adjust to previous Sunday
  startDate.setDate(startDate.getDate() - startDate.getDay());

  let currentDate = new Date(startDate);

  for (let week = 0; week < 53; week++) {
    const days: Date[] = [];
    for (let day = 0; day < 7; day++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(days);
  }

  return weeks;
}

function getDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getActivityLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 59, g: 130, b: 246 }; // default blue
}

function getColorForLevel(level: number, baseColor: string): string {
  if (level === 0) return 'var(--secondary)';

  const { r, g, b } = hexToRgb(baseColor);
  const opacity = 0.2 + (level * 0.2); // 0.2, 0.4, 0.6, 0.8, 1.0

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ActivityHeatmap({ tasks, color }: ActivityHeatmapProps) {
  const dateGrid = useMemo(() => generateDateGrid(), []);

  // Count completed tasks per day
  const activityMap = useMemo(() => {
    const map: Record<string, number> = {};

    tasks.forEach((task) => {
      if (task.completed_at) {
        const dateKey = task.completed_at.split('T')[0];
        map[dateKey] = (map[dateKey] || 0) + 1;
      }
    });

    return map;
  }, [tasks]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    dateGrid.forEach((week, weekIndex) => {
      const firstDayOfWeek = week[0];
      const month = firstDayOfWeek.getMonth();

      if (month !== lastMonth) {
        labels.push({ month: MONTHS[month], weekIndex });
        lastMonth = month;
      }
    });

    return labels;
  }, [dateGrid]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-fit">
        {/* Month labels */}
        <div className="flex ml-8 mb-1">
          {monthLabels.map(({ month, weekIndex }, i) => (
            <div
              key={i}
              className="text-xs text-muted-foreground"
              style={{
                position: 'relative',
                left: `${weekIndex * 12}px`,
                width: '36px'
              }}
            >
              {month}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1 text-xs text-muted-foreground">
            {DAYS.map((day, i) => (
              <div key={day} className="h-[10px] flex items-center">
                {i % 2 === 1 ? day.slice(0, 1) : ''}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {dateGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[2px]">
                {week.map((date, dayIndex) => {
                  const dateKey = getDateKey(date);
                  const count = activityMap[dateKey] || 0;
                  const level = getActivityLevel(count);
                  const isFuture = date > today;

                  return (
                    <div
                      key={dayIndex}
                      className="w-[10px] h-[10px] rounded-sm"
                      style={{
                        backgroundColor: isFuture
                          ? 'transparent'
                          : getColorForLevel(level, color),
                        border: isFuture ? '1px dashed var(--border)' : 'none'
                      }}
                      title={`${dateKey}: ${count} task${count !== 1 ? 's' : ''} completed`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-[10px] h-[10px] rounded-sm"
              style={{ backgroundColor: getColorForLevel(level, color) }}
            />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
}
