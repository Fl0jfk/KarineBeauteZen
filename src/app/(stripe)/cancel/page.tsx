import { Suspense } from 'react';
import CancelContent from './CancelContent';

type SearchParams = { token?: string;};

export default function CancelPage({ searchParams}: { searchParams: Promise<SearchParams>}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <CancelContent searchParams={searchParams} />
    </Suspense>
  );
}
