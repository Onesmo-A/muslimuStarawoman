import React from 'react';

export function ChartCard({ title, value }) {
    return (
        <div className="chart-card">
            <span>{title}</span>
            <strong>{value}</strong>
        </div>
    );
}
