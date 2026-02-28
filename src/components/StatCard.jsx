import React from 'react';

const StatCard = ({ title, value, icon, trend, color }) => {
    return (
        <div className="card fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</p>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>{value}</h3>
                {trend && (
                    <p style={{
                        fontSize: '0.75rem',
                        color: trend.startsWith('+') ? 'var(--success)' : 'var(--error)',
                        marginTop: '0.5rem',
                        fontWeight: 600
                    }}>
                        {trend} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>from last month</span>
                    </p>
                )}
            </div>
            <div style={{
                width: '56px',
                height: '56px',
                backgroundColor: `${color || 'var(--primary-blue)'}15`,
                color: color || 'var(--primary-blue)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.75rem'
            }}>
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
