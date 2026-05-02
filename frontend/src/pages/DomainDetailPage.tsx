import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DomainFormDialog } from '@/features/domains/components/DomainFormDialog';
import { DeleteConfirmDialog } from '@/features/domains/components/DeleteConfirmDialog';
import { ActivityHeatmap } from '@/features/domains/components/ActivityHeatmap';
import { ProjectList } from '@/features/projects/components/ProjectList';
import { ProjectFormDialog } from '@/features/projects/components/ProjectFormDialog';
import { TaskList } from '@/features/tasks/components/TaskList';
import { TaskFormDialogWithProject } from '@/features/tasks/components/TaskFormDialogWithProject';
import { useDomain, useUpdateDomain, useDeleteDomain } from '@/hooks/useDomains';
import { useProjectsByDomain, useCreateProject } from '@/hooks/useProjects';
import { useTasksByDomain, useCreateTask, useUpdateTask, useCompleteTask, useDeleteTask } from '@/hooks/useTasks';
import type { Task } from '@/types';

export function DomainDetailPage() {
  const { domainId } = useParams<{ domainId: string }>();
  const navigate = useNavigate();
  const id = Number(domainId);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const { data: domain, isLoading: domainLoading } = useDomain(id);
  const { data: projects, isLoading: projectsLoading } = useProjectsByDomain(id);
  const { data: tasks, isLoading: tasksLoading } = useTasksByDomain(id);
  const updateDomain = useUpdateDomain();
  const deleteDomain = useDeleteDomain();
  const createProject = useCreateProject();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const completeTask = useCompleteTask();
  const deleteTask = useDeleteTask();

  const handleUpdate = (data: Parameters<typeof updateDomain.mutate>[0]['data']) => {
    updateDomain.mutate(
      { id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          toast.success('Domain updated');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleDelete = () => {
    deleteDomain.mutate(id, {
      onSuccess: () => {
        toast.success('Domain deleted');
        navigate('/domains');
      },
      onError: (err) => toast.error(err.message),
    });
  };

  const handleCreateProject = (data: Parameters<typeof createProject.mutate>[0]) => {
    createProject.mutate(
      { ...data, domain_id: id },
      {
        onSuccess: () => {
          setProjectDialogOpen(false);
          toast.success('Project created');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleCreateTask = (data: Parameters<typeof createTask.mutate>[0]) => {
    createTask.mutate(
      { ...data, domain_id: id },
      {
        onSuccess: () => {
          setTaskDialogOpen(false);
          toast.success('Task created');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleUpdateTask = (data: Parameters<typeof createTask.mutate>[0]) => {
    if (!editingTask) return;
    updateTask.mutate(
      { id: editingTask.id, data },
      {
        onSuccess: () => {
          setEditingTask(null);
          toast.success('Task updated');
        },
        onError: (err) => toast.error(err.message),
      }
    );
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
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

  if (domainLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!domain) {
    return <div className="text-center py-12">Domain not found</div>;
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/domains" className="text-sm text-muted-foreground hover:text-primary">
          ← Back to Domains
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          <div
            className="w-6 h-6 rounded-full"
            style={{ backgroundColor: domain.color }}
          />
          <div>
            <h1 className="text-3xl font-bold">{domain.name}</h1>
            {domain.description && (
              <p className="text-muted-foreground mt-1">{domain.description}</p>
            )}
          </div>
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

      {/* Activity Heatmap */}
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {tasksLoading ? (
            <div className="text-muted-foreground">Loading activity...</div>
          ) : (
            <ActivityHeatmap tasks={tasks || []} color={domain.color} />
          )}
        </CardContent>
      </Card>

      {/* Projects Section */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Projects</h2>
        <Button onClick={() => setProjectDialogOpen(true)}>+ New Project</Button>
      </div>

      {projectsLoading ? (
        <div>Loading projects...</div>
      ) : (
        <ProjectList projects={projects || []} />
      )}

      {/* Tasks Section */}
      <div className="flex items-center justify-between mb-4 mt-8">
        <h2 className="text-xl font-semibold">All Tasks in Domain</h2>
        <Button
          onClick={() => setTaskDialogOpen(true)}
          disabled={!projects || projects.length === 0}
        >
          + New Task
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Create a project first to add tasks.
        </div>
      ) : tasksLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <TaskList
          tasks={tasks || []}
          onComplete={handleCompleteTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}

      <DomainFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleUpdate}
        domain={domain}
        isSubmitting={updateDomain.isPending}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Domain"
        description="This will permanently delete this domain and all its projects and tasks. This action cannot be undone."
        isDeleting={deleteDomain.isPending}
      />

      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={setProjectDialogOpen}
        onSubmit={handleCreateProject}
        domainId={id}
        isSubmitting={createProject.isPending}
      />

      {projects && projects.length > 0 && (
        <>
          <TaskFormDialogWithProject
            open={taskDialogOpen}
            onOpenChange={setTaskDialogOpen}
            onSubmit={handleCreateTask}
            projects={projects}
            domainId={id}
            isSubmitting={createTask.isPending}
          />
          <TaskFormDialogWithProject
            open={!!editingTask}
            onOpenChange={(open) => !open && setEditingTask(null)}
            onSubmit={handleUpdateTask}
            projects={projects}
            domainId={id}
            task={editingTask || undefined}
            isSubmitting={updateTask.isPending}
          />
        </>
      )}
    </div>
  );
}
