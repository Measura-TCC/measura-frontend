import React from 'react';
import { SWRConfig } from 'swr';
import { measuraApi } from './measuraApi';

export const swrConfig = {
  fetcher: (url: string) => measuraApi.get(url).then(res => res.data),
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  revalidateIfStale: true,
  revalidateOnMount: true,
};

export const SWRProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SWRConfig value={swrConfig}>
      {children}
    </SWRConfig>
  );
}; 