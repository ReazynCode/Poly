import { DomainCard } from './DomainCard';
import type { Domain } from '@/types';

interface DomainListProps {
  domains: Domain[];
}

export function DomainList({ domains }: DomainListProps) {
  if (domains.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No domains yet. Create your first domain to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {domains.map((domain) => (
        <DomainCard key={domain.id} domain={domain} />
      ))}
    </div>
  );
}
