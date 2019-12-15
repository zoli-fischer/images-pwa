import React from 'react';
import { render } from 'react-dom';
import document from 'global/document';
import window from 'global/window';
import App from './App';
import './styles.css';

// Check that service workers are supported
const loadServiceWorker = () => {
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
        // Use the window load event to keep the page load performant
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
                .then((registration) => {
                    // eslint-disable-next-line no-console
                    console.log('Service worker registration succeeded:', registration);
                }, (error) => {
                    // eslint-disable-next-line no-console
                    console.log('Service worker registration failed:', error);
                });
        });
    }
};

render(<App />, document.getElementById('root'), () => {
    loadServiceWorker();
});
