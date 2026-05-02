import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { DomainList } from '@/features/domains/components/DomainList';
import { DomainFormDialog } from '@/features/domains/components/DomainFormDialog';
import { useDomains, useCreateDomain } from '@/hooks/useDomains';

export function DomainsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: domains, isLoading, error } = useDomains();
  const createDomain = useCreateDomain();

  const handleCreate = (data: Parameters<typeof createDomain.mutate>[0]) => {
    createDomain.mutate(data, {
      onSuccess: () => {
        setDialogOpen(false);
        toast.success('Domain created successfully');
      },
      onError: (err) => {
        toast.error(err.message || 'Failed to create domain');
      },
    });
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading domains...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        Error loading domains. Is the backend running?
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Domains</h1>
        <Button onClick={() => setDialogOpen(true)}>+ New Domain</Button>
      </div>

      <DomainList domains={domains || []} />

      <DomainFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleCreate}
        isSubmitting={createDomain.isPending}
      />
    </div>
  );
}
