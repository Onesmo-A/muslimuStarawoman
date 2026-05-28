import React from 'react';

export function DataTable({ columns, rows }) {
    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
                </thead>
                <tbody>
                    {rows.map((row, idx) => (
                        <tr key={idx}>{row.map((cell, cIdx) => <td key={cIdx}>{cell}</td>)}</tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
