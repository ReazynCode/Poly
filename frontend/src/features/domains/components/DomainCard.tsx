import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Domain } from '@/types';

interface DomainCardProps {
  domain: Domain;
}

export function DomainCard({ domain }: DomainCardProps) {
  return (
    <Link to={`/domains/${domain.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: domain.color }}
            />
            <CardTitle className="text-lg">{domain.name}</CardTitle>
          </div>
          {domain.description && (
            <CardDescription className="line-clamp-2">
              {domain.description}
            </CardDescription>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
