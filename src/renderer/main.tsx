import {
    PersistedClient,
    Persister,
    PersistQueryClientProvider,
} from '@tanstack/react-query-persist-client';
import { del, get, set } from 'idb-keyval';
import { createRoot } from 'react-dom/client';

import { App } from '/@/renderer/app';
import { queryClient } from '/@/renderer/lib/react-query';

function createIDBPersister(idbValidKey: IDBValidKey = 'reactQuery') {
    return {
        persistClient: async (client: PersistedClient) => {
            set(idbValidKey, client);
        },
        removeClient: async () => {
            await del(idbValidKey);
        },
        restoreClient: async () => {
            return await get<PersistedClient>(idbValidKey);
        },
    } as Persister;
}

const indexedDbPersister = createIDBPersister('feishin');

const initializeAnalytics = () => {
    const analyticsDisabled = (window as unknown as { ANALYTICS_DISABLED?: boolean | string })
        .ANALYTICS_DISABLED;

    if (
        localStorage.getItem('umami.disabled') === '1' ||
        analyticsDisabled === true ||
        analyticsDisabled === 'true'
    ) {
        return;
    }

    const script = document.createElement('script');
    script.defer = true;
    script.src = 'https://umami.jeffvli.org/script.js';
    script.setAttribute('data-website-id', '5120fc56-cffa-4d42-8b6c-9afb6f459251');
    script.setAttribute('data-exclude-search', 'true');
    script.setAttribute('data-exclude-hash', 'true');
    script.setAttribute('data-auto-track', 'false');
    document.head.appendChild(script);
};

initializeAnalytics();

createRoot(document.getElementById('root')!).render(
    <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
            buster: 'feishin',
            dehydrateOptions: {
                shouldDehydrateQuery: (query) => {
                    const isSuccess = query.state.status === 'success';
                    const isLyricsQueryKey =
                        query.queryKey.includes('song') &&
                        query.queryKey.includes('lyrics') &&
                        query.queryKey.includes('select');

                    return isSuccess && isLyricsQueryKey;
                },
            },
            hydrateOptions: {
                defaultOptions: {
                    queries: {
                        gcTime: Infinity,
                    },
                },
            },
            maxAge: Infinity,
            persister: indexedDbPersister,
        }}
    >
        <App />
    </PersistQueryClientProvider>,
);
