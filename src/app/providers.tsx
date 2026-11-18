'use client';

import { DataProvider, type Data } from '@/app/contexts/data';

export default function Providers({ children, initialData }: { children: React.ReactNode; initialData?: Data }) {
  return <DataProvider initialData={initialData}>{children}</DataProvider>;
}
