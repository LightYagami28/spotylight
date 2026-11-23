import type {
    DefaultOptions,
    QueryOptions,
    UseInfiniteQueryOptions,
    UseMutationOptions,
    UseQueryOptions,
} from '@tanstack/react-query';

import { QueryCache, QueryClient } from '@tanstack/react-query';

import { toast } from '/@/shared/components/toast/toast';

const queryCache = new QueryCache({
    onError: (error: any, query) => {
        if (query.state.data !== undefined) {
            console.error(error);
            toast.show({ message: `${error.message}`, type: 'error' });
        }
    },
});

const queryConfig: DefaultOptions = {
    mutations: {
        retry: process.env.NODE_ENV === 'production' ? 3 : false,
    },
    queries: {
        gcTime: 1000 * 20, // 20 seconds
        refetchOnWindowFocus: false,
        retry: process.env.NODE_ENV === 'production',
        staleTime: 1000 * 10, // 10 seconds
        throwOnError: (error: any) => {
            return error?.response?.status >= 500;
        },
    },
};

export const queryClient = new QueryClient({
    defaultOptions: queryConfig,
    queryCache,
});

export type InfiniteQueryHookArgs<T> = {
    options?: UseInfiniteQueryOptions;
    query: T;
    serverId: string | undefined;
};

export type MutationHookArgs = {
    options?: MutationOptions;
};

export type MutationOptions = {
    mutationKey: UseMutationOptions['mutationKey'];
    onError?: (err: any) => void;
    onSettled?: any;
    onSuccess?: any;
    retry?: UseQueryOptions['retry'];
    retryDelay?: UseQueryOptions['retryDelay'];
    useErrorBoundary?: boolean;
};

export type QueryHookArgs<T> = {
    options?: UseQueryHookOptions;
    query: T;
    serverId: string;
};

type UseQueryHookOptions = {
    enabled?: boolean;
    gcTime?: QueryOptions['gcTime'];
    meta?: any;
    networkMode?: any;
    notifyOnChangeProps?: any;
    placeholderData?: (prev: any) => any;
    queryKey?: any;
    queryKeyHashFn?: any;
    refetchInterval?: number;
    refetchIntervalInBackground?: boolean;
    refetchOnMount?: any;
    refetchOnReconnect?: any;
    refetchOnWindowFocus?: any;
    retry?: any;
    retryDelay?: any;
    retryOnMount?: any;
    staleTime?: number;
    structuralSharing?: any;
    subscribed?: boolean;
    throwOnError?: boolean;
};
