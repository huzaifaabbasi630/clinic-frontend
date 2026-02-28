import React, { useState } from 'react';
import { MdTrendingUp, MdPieChart, MdTimeline } from 'react-icons/md';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    RadialLinearScale,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const Analytics = () => {
    const doughnutData = {
        labels: ['Cardiology', 'Neurology', 'Pediatrics', 'General'],
        datasets: [
            {
                data: [30, 20, 25, 25],
                backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#ef4444'],
            },
        ],
    };

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0 }}>Advanced Analytics</h2>
                <p style={{ color: 'var(--text-muted)' }}>In-depth insights into hospital operations and patient care.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdPieChart color="var(--primary-blue)" /> Patient Distribution by Department
                    </h4>
                    <div style={{ height: '300px', display: 'flex', justifyContent: 'center' }}>
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>

                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdTrendingUp color="var(--success)" /> Efficiency Rate
                    </h4>
                    <div style={{ height: '300px', backgroundColor: 'var(--bg-light)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <h1 style={{ fontSize: '4rem', color: 'var(--primary-blue)', margin: 0 }}>94%</h1>
                            <p style={{ color: 'var(--text-muted)' }}>Average Appointment Completion Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
