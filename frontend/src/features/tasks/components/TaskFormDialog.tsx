import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Task, TaskCreate, TaskStatus, TaskPriority, TaskIntent } from '@/types';

interface TaskFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TaskCreate) => void;
  task?: Task;
  projectId: number;
  domainId: number;
  isSubmitting?: boolean;
}

export function TaskFormDialog({
  open,
  onOpenChange,
  onSubmit,
  task,
  projectId,
  domainId,
  isSubmitting = false,
}: TaskFormDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [intent, setIntent] = useState<TaskIntent>('work');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [url, setUrl] = useState('');
  const [dueDate, setDueDate] = useState('');

  const isEditing = !!task;

  useEffect(() => {
    if (open) {
      if (task) {
        setTitle(task.title);
        setDescription(task.description || '');
        setStatus(task.status);
        setIntent(task.intent);
        setPriority(task.priority);
        setUrl(task.url || '');
        setDueDate(task.due_date ? task.due_date.slice(0, 10) : '');
      } else {
        setTitle('');
        setDescription('');
        setStatus('pending');
        setIntent('work');
        setPriority('medium');
        setUrl('');
        setDueDate('');
      }
    }
  }, [open, task]);

  // Check if form has actual changes (dirty tracking)
  const hasChanges = isEditing
    ? title.trim() !== task?.title ||
      (description.trim() || null) !== (task?.description || null) ||
      status !== task?.status ||
      intent !== task?.intent ||
      priority !== task?.priority ||
      (url.trim() || null) !== (task?.url || null) ||
      (dueDate || null) !== (task?.due_date?.slice(0, 10) || null)
    : true; // For new tasks, always allow submit if title exists

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      description: description.trim() || undefined,
      status,
      intent,
      priority,
      url: intent === 'passive' ? url.trim() || undefined : undefined,
      due_date: dueDate || undefined,
      project_id: projectId,
      domain_id: domainId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="intent">Task Type</Label>
            <Select value={intent} onValueChange={(v) => setIntent(v as TaskIntent)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="passive">
                  📺 Passive Learning (watch, read, listen)
                </SelectItem>
                <SelectItem value="work">
                  🛠️ Work Task (build, practice, create)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={intent === 'passive'
                ? "e.g., Watch 3Blue1Brown neural network video"
                : "e.g., Build a simple neural network"}
              required
            />
          </div>

          {intent === 'passive' && (
            <div className="space-y-2">
              <Label htmlFor="url">Content URL</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=... or article URL"
              />
              <p className="text-xs text-muted-foreground">
                YouTube videos will show a thumbnail preview
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Notes (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={intent === 'passive'
                ? "Key takeaways or timestamps..."
                : "What needs to be done?"}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date (optional)</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !title.trim() || !hasChanges}>
              {isSubmitting
                ? isEditing
                  ? 'Saving...'
                  : 'Creating...'
                : isEditing
                  ? hasChanges ? 'Save Changes' : 'No Changes'
                  : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
