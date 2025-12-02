import { Suspense } from 'react';
import SuccessContent from './SuccessContent';

type SearchParams = {
  token?: string;
  title?: string;
  amount?: string;
  namecos?: string;
  namedes?: string;
  mailcos?: string;
};

export default function SuccessPage({ searchParams}: { searchParams: Promise<SearchParams>}) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <SuccessContent searchParams={searchParams} />
    </Suspense>
  );
}
