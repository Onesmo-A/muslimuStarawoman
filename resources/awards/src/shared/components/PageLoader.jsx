import React from 'react';
import { createPortal } from 'react-dom';
import logo from '../../assets/mswa-logo.png';

const PageLoader = () => {
    const loader = (
        <div className="page-loader" role="status" aria-live="polite">
            <div className="loader-emblem">
                <img src={logo} alt="Muslim Stara Women Awards logo" />
            </div>
            <div className="loader-logo">Muslim Stara Women Awards</div>
        </div>
    );

    if (typeof document !== 'undefined' && document.body) {
        return createPortal(loader, document.body);
    }

    return loader;
};

export default PageLoader;
