import { useEffect, useState } from 'react';
import Setup from './pages/CreateSetup';
import Dashboard from './pages/Dashboard';
import Reconnect from './pages/Reconnect';

export default function MassTrigger() {
    const [clientId, setClientId] = useState<string | null>(null);
    const [mode, setMode] = useState<'setup' | 'reconnect' | 'dashboard'>('setup');

    useEffect(() => {
        const savedId = localStorage.getItem('massTriggerClientId');
        if (savedId) {
            setClientId(savedId);
            setMode('dashboard');
        } else {
            setMode('setup'); // inicia mostrando o cadastro
        }
    }, []);

    if (mode === 'reconnect') {
        return (
            <Reconnect
                onReconnect={(id) => {
                    setClientId(id);
                    setMode('dashboard');
                }}
            />
        );
    }

    if (mode === 'setup') {
        return (
            <div>
                <Setup
                    onRegister={(id) => {
                        setClientId(id);
                        setMode('dashboard');
                    }}
                />

                <div className='text-center mt-4'>
                    <button onClick={() => setMode('reconnect')} className='text-blue-600 hover:underline'>
                        Já tenho um Client ID
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Dashboard
            clientId={clientId!}
            onDisconnect={() => {
                localStorage.removeItem('massTriggerClientId');
                setClientId(null);
                setMode('reconnect');
            }}
        />
    );
}
