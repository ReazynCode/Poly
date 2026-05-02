import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectFormDialog } from '@/features/projects/components/ProjectFormDialog';
import { DeleteConfirmDialog } from '@/features/domains/components/DeleteConfirmDialog';
import { TaskList } from '@/features/tasks/components/TaskList';
import { TaskFormDialog } from '@/features/tasks/components/TaskFormDialog';
import { useProject, useUpdateProject, useDeleteProject } from '@/hooks/useProjects';
import { useTasksByProject, useCreateTask, useCompleteTask, useDeleteTask } from '@/hooks/useTasks';
import type { ProjectStatus } from '@/types';

const statusLabels: Record<ProjectStatus, string> = {
  active: 'Active',
  completed: 'Completed',
  on_hold: 'On Hold',
  archived: 'Archived',
};

export function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const id = Number(projectId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);

  const { data: project, isLoading: projectLoading } = useProject(id);
  const { data: tasks, isLoading: tasksLoading } = useTasksByProject(id);
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const createTask = useCreateTask();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const handleUpdate = (data: Parameters<typeof updateProject.mutate>[0]['data']) => {
    updateProject.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          toast.success('Project updated');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = () => {
    deleteProject.mutate(id, {
      onSuccess: () => {
        toast.success('Project deleted');
        navigate(-1);
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleCreateTask = (data: Parameters<typeof createTask.mutate>[0]) => {
    if (!project) return;
    createTask.mutate(
      { ...data, project_id: id, domain_id: project.domain_id },
      {
        onSuccess: () => {
          setTaskDialogOpen(false);
          toast.success('Task created');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleCompleteTask = (taskId: number) => {
    completeTask.mutate(taskId, {
      onSuccess: () => toast.success('Task completed!'),
      onError: (err) => toast.error(err.message),
    });
  };

  const handleDeleteTask = (taskId: number) => {
    deleteTask.mutate(taskId, {
      onSuccess: () => toast.success('Task deleted'),
      onError: (err) => toast.error(err.message),
    });
  };

  if (projectLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          to={`/domains/${project.domain_id}`}
          className="text-sm text-muted-foreground hover:text-primary"
        >
          ← Back to Domain
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <Badge>{statusLabels[project.status]}</Badge>
          </div>
          {project.description && (
            <p className="text-muted-foreground">{project.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <Button onClick={() => setTaskDialogOpen(true)}>+ New Task</Button>
      </div>

      {tasksLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks || []}
          onComplete={handleCompleteTask}
          onDelete={handleDeleteTask}
        />
      )}

      <ProjectFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdate}
        project={project}
        domainId={project.domain_id}
        isSubmitting={updateProject.isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Project"
        description="This will permanently delete this project and all its tasks. This action cannot be undone."
        isDeleting={deleteProject.isPending}
      />

      <TaskFormDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        onSubmit={handleCreateTask}
        projectId={id}
        domainId={project.domain_id}
        isSubmitting={createTask.isPending}
      />
    </div>
  );
}
