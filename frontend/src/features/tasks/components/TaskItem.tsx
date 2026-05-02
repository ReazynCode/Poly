import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { parseUrl } from '@/lib/url-utils';
import type { Task, TaskPriority, TaskIntent } from '@/types';

const priorityVariants: Record<TaskPriority, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  low: 'secondary',
  medium: 'default',
  high: 'outline',
  urgent: 'destructive',
};

const priorityLabels: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

const intentStyles: Record<TaskIntent, { label: string; icon: string; className: string }> = {
  passive: {
    label: 'Passive',
    icon: '📺',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  },
  work: {
    label: 'Work',
    icon: '🛠️',
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  },
};

interface TaskItemProps {
  task: Task;
  onComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onComplete, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const urlMeta = task.url ? parseUrl(task.url) : null;
  const isPassive = task.intent === 'passive';
  const intentStyle = intentStyles[task.intent];

  return (
    <div className={`border rounded-lg overflow-hidden ${isCompleted ? 'opacity-60' : ''}`}>
      {/* YouTube thumbnail preview for passive tasks */}
      {isPassive && urlMeta?.type === 'youtube' && urlMeta.thumbnailUrl && !isCompleted && (
        <a
          href={task.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="block relative group"
        >
          <img
            src={urlMeta.thumbnailUrl}
            alt="Video thumbnail"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-4xl">▶</span>
          </div>
          <Badge className="absolute top-2 left-2 bg-red-600 hover:bg-red-600">
            YouTube
          </Badge>
        </a>
      )}

      <div className="flex items-center gap-4 p-4">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={() => !isCompleted && onComplete(task.id)}
          disabled={isCompleted}
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs ${intentStyle.className}`}>
              {intentStyle.icon} {intentStyle.label}
            </Badge>
            <span className={isCompleted ? 'line-through text-muted-foreground' : 'font-medium'}>
              {task.title}
            </span>
            <Badge variant={priorityVariants[task.priority]} className="text-xs">
              {priorityLabels[task.priority]}
            </Badge>
            {isPassive && urlMeta && urlMeta.type !== 'youtube' && (
              <Badge variant="outline" className="text-xs gap-1">
                <img
                  src={urlMeta.favicon}
                  alt=""
                  className="w-3 h-3"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                {urlMeta.label}
              </Badge>
            )}
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            {task.due_date && (
              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
            )}
            {isPassive && task.url && urlMeta?.type !== 'youtube' && (
              <a
                href={task.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <span>{urlMeta?.icon}</span>
                Open {urlMeta?.type === 'article' ? 'article' : urlMeta?.type}
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
