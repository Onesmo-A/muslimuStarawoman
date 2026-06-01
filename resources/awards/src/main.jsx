import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { store } from './app/store';

const basename = document.querySelector('meta[name="spa-base-path"]')?.content || '/';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter basename={basename === '/' ? undefined : basename}>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
);
