'use client';

import { Provider } from 'react-redux';
import store from '@/app/redux/store';
import { DataProvider } from '@/app/contexts/data';

export default function Providers({ children,}: { children: React.ReactNode;}) {
  return (
    <DataProvider>
      <Provider store={store}>{children}</Provider>
    </DataProvider>
  );
}
