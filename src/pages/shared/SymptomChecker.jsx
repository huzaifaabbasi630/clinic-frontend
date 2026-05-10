import React, { useState } from 'react';
import { MdAdd, MdHistory, MdChat, MdAssignment, MdLock } from 'react-icons/md';
import FormInput from '../../components/FormInput';
import { toast } from 'react-toastify';
import { aiService } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

const SymptomChecker = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        symptoms: '',
        age: '',
        gender: 'male',
        history: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const isPro = user?.subscriptionPlan === 'pro' || user?.role === 'admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!isPro) {
            toast.warning('This is a Pro feature. Please upgrade your plan.');
            return;
        }

        setLoading(true);
        try {
            const res = await aiService.checkSymptoms(formData);
            const aiResponse = res.data.response;
            
            // Format response if it's a string from AI
            if (typeof aiResponse.analysis === 'string') {
                setResult({
                    analysis: aiResponse.analysis,
                    isFallback: res.data.isFallback
                });
            } else {
                setResult(aiResponse);
            }
            
            toast.success('Analysis complete!');
        } catch (error) {
            const msg = error.response?.data?.message || 'AI Analysis failed';
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-blue)' }}>AI Symptom Checker</h2>
                <p style={{ color: 'var(--text-muted)' }}>Get instant medical insights based on advanced health patterns</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: '2rem', transition: 'all 0.5s ease' }}>
                <div className="card">
                    <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MdChat color="var(--primary-blue)" /> Describe Your Symptoms
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <FormInput
                            label="What are your symptoms?"
                            type="textarea"
                            name="symptoms"
                            value={formData.symptoms}
                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                            placeholder="e.g. Dry cough for 3 days, slight fever, headache..."
                            required
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <FormInput
                                label="Age"
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                required
                            />
                            <FormInput
                                label="Gender"
                                type="select"
                                name="gender"
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                options={[
                                    { value: 'male', label: 'Male' },
                                    { value: 'female', label: 'Female' },
                                    { value: 'other', label: 'Other' }
                                ]}
                                required
                            />
                        </div>

                        <FormInput
                            label="Medical History (Optional)"
                            type="textarea"
                            name="history"
                            value={formData.history}
                            onChange={(e) => setFormData({ ...formData, history: e.target.value })}
                            placeholder="e.g. Hypertension, Diabetic..."
                        />

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ width: '100%', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                            disabled={loading}
                        >
                            {!isPro && <MdLock size={16} />}
                            {loading ? 'Analyzing Symptoms...' : 'Process with AI'}
                        </button>
                    </form>
                    {!isPro && (
                        <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', color: '#92400e', fontSize: '0.75rem', textAlign: 'center' }}>
                            Upgrade to <strong>PRO</strong> to unlock AI Symptom Analysis
                        </div>
                    )}
                </div>

                {result && (
                    <div className="card fade-in" style={{ backgroundColor: 'rgba(37, 99, 235, 0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h4 style={{ margin: 0 }}>Analysis Result</h4>
                            {result.riskLevel && (
                                <span style={{
                                    padding: '0.25rem 1rem',
                                    borderRadius: '20px',
                                    backgroundColor: result.riskLevel === 'Low' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: result.riskLevel === 'Low' ? 'var(--success)' : 'var(--error)',
                                    fontWeight: 600,
                                    fontSize: '0.75rem'
                                }}>
                                    {result.riskLevel} Risk
                                </span>
                            )}
                        </div>

                        {result.analysis ? (
                            <div style={{ lineHeight: '1.6', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                                {result.analysis}
                            </div>
                        ) : (
                            <>
                                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '1rem' }}>Possible Conditions:</p>
                                {result.conditions?.map((c, i) => (
                                    <div key={i} style={{ marginBottom: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', borderLeft: `4px solid ${i === 0 ? 'var(--primary-blue)' : 'var(--border-color)'}` }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <span style={{ fontWeight: 600 }}>{c.name}</span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{c.probability} Confidence</span>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{c.details}</p>
                                    </div>
                                ))}

                                <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '8px' }}>
                                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <MdAssignment /> Suggested Next Steps:
                                    </p>
                                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8rem', margin: 0 }}>
                                        {result.suggestedActions?.map((a, i) => <li key={i} style={{ marginBottom: '0.25rem' }}>{a}</li>)}
                                    </ul>
                                </div>
                            </>
                        )}
                        {result.isFallback && (
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '1rem', fontStyle: 'italic' }}>
                                * Running in offline/fallback mode.
                            </p>
                        )}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '2rem', padding: '1rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.1)', fontSize: '0.8rem' }}>
                <strong>Disclaimer:</strong> This tool is powered by AI for informational purposes only. It is not a clinical diagnosis. Please consult a qualified healthcare professional for medical advice.
            </div>
        </div>
    );
};

export default SymptomChecker;
