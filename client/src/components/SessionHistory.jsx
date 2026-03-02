export const SessionHistory = ({ sessions }) => {
    return (
        <div className="w-full max-w-2xl px-4 pb-8 space-y-4">
            <h3 className="mb-6 text-xl tracking-wider text-gray-300">Recent Sessions</h3>
            {sessions.length === 0 && <p className="text-center text-gray-500">No sessions recorded yet.</p>}

            {sessions.map(session => (
                <div key={session._idId || session._id} className="p-4 border border-gray-800 rounded-lg bg-gray-900/30 flex items-center justify-between">
                    <div>
                        <div className="text-sm text-gray-400">
                            {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(new Date(session.timestamp))}
                        </div>
                        <div className="text-xs uppercase tracking-wider mt-1 opacity-70">
                            Intervention: {session.interventionType || 'None'}
                        </div>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold rounded-full ${session.stressLevel === 'CRITICAL' ? 'bg-red-900/50 text-red-400 border border-red-800' :
                            session.stressLevel === 'HIGH' ? 'bg-orange-900/50 text-orange-400 border border-orange-800' :
                                session.stressLevel === 'MEDIUM' ? 'bg-amber-900/50 text-amber-400 border border-amber-800' :
                                    'bg-cyan-900/50 text-cyan-400 border border-cyan-800'
                        }`}>
                        {session.stressLevel} ({session.stressScore})
                    </div>
                </div>
            ))}
        </div>
    );
};
