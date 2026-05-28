import React from 'react';

export function Card({ title, children }) {
    return (
        <article className="card">
            {title ? <h3>{title}</h3> : null}
            {children}
        </article>
    );
}
