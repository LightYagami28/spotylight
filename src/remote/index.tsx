import { createRoot } from 'react-dom/client';

import { App } from '/@/remote/app';

if ('serviceWorker' in navigator) {
    const version = encodeURIComponent(__APP_VERSION__);
    const prod = encodeURIComponent(String(__APP_PROD__));
    navigator.serviceWorker.register(`/worker.js?version=${version}&prod=${prod}`);
}

const container = document.getElementById('root')! as HTMLElement;
const root = createRoot(container);

root.render(<App />);
