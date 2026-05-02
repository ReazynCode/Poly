import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDomains } from '@/hooks/useDomains';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import type { Domain, Project, Task } from '@/types';

interface DomainStats {
  domain: Domain;
  projectCount: number;
  totalTasks: number;
  completedTasks: number;
  completionPercent: number;
}

function calculateDomainStats(
  domains: Domain[],
  projects: Project[],
  tasks: Task[]
): DomainStats[] {
  return domains.map((domain) => {
    const domainProjects = projects.filter((p) => p.domain_id === domain.id);
    const domainTasks = tasks.filter((t) => t.domain_id === domain.id);
    const completedTasks = domainTasks.filter((t) => t.status === 'completed').length;
    const totalTasks = domainTasks.length;
    const completionPercent = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      domain,
      projectCount: domainProjects.length,
      totalTasks,
      completedTasks,
      completionPercent,
    };
  });
}

export function DashboardPage() {
  const { data: domains, isLoading: domainsLoading } = useDomains();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: tasks, isLoading: tasksLoading } = useTasks();

  const isLoading = domainsLoading || projectsLoading || tasksLoading;

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const domainStats = calculateDomainStats(
    domains || [],
    projects || [],
    tasks || []
  );

  // Overall stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'completed').length || 0;
  const overallPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Overall Summary */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Domains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{domains?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedTasks} / {totalTasks}</div>
            <div className="mt-2 h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${overallPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{overallPercent}% complete</p>
          </CardContent>
        </Card>
      </div>

      {/* Per-Domain Progress */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Progress by Domain</h2>
        <Link to="/domains" className="text-sm text-primary hover:underline">
          Manage domains →
        </Link>
      </div>

      {domainStats.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <p>No domains yet.</p>
            <Link to="/domains" className="text-primary hover:underline">
              Create your first domain →
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {domainStats.map(({ domain, projectCount, totalTasks, completedTasks, completionPercent }) => (
            <Link key={domain.id} to={`/domains/${domain.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: domain.color }}
                    />
                    <CardTitle className="text-lg">{domain.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Projects</span>
                      <span className="font-medium">{projectCount}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasks</span>
                      <span className="font-medium">{completedTasks} / {totalTasks}</span>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{completionPercent}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${completionPercent}%`,
                            backgroundColor: domain.color
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
