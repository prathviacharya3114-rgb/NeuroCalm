import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getSessions } from '../api/neurocalm';
import { SessionHistory } from '../components/SessionHistory';

export const Dashboard = () => {
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await getSessions();
                setSessions(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSessions();
    }, []);

    // Format data for chart (reverse so oldest is first)
    const chartData = [...sessions].reverse().map(s => ({
        time: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(s.timestamp)),
        score: s.stressScore
    }));

    return (
        <div className="flex flex-col items-center min-h-screen bg-[#050B18] text-white p-6 md:p-12">
            <div className="w-full max-w-4xl flex justify-between items-center mb-12">
                <h1 className="text-3xl font-orbitron tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">NeuroCalm Dashboard</h1>
                <button onClick={() => navigate('/')} className="px-6 py-2 text-sm tracking-wider uppercase border border-cyan-800 rounded-full text-cyan-400 hover:bg-cyan-900/30 transition-colors">
                    Home
                </button>
            </div>

            {sessions.length > 0 ? (
                <div className="w-full max-w-4xl h-64 mb-16 p-6 border border-gray-800 rounded-xl bg-gray-900/20">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <XAxis dataKey="time" hide />
                            <YAxis domain={[0, 100]} stroke="#374151" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px' }}
                                itemStyle={{ color: '#00F5FF' }}
                            />
                            <Line type="monotone" dataKey="score" stroke="#7B2FFF" strokeWidth={3} dot={{ fill: '#00F5FF', r: 4 }} activeDot={{ r: 6, fill: '#00F5FF' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p className="text-gray-500 text-lg mb-12">Take your first session to see your stress trends.</p>
            )}

            <SessionHistory sessions={sessions} />
        </div>
    );
};
