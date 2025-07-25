import { useState } from 'react';

interface ReconnectProps {
    onReconnect: (clientId: string) => void;
}

export default function Reconnect({ onReconnect }: ReconnectProps) {
    const [clientId, setClientId] = useState('');
    const [error, setError] = useState('');

    const handleReconnect = () => {
        if (!clientId.trim()) {
            setError('⚠️ Informe o Client ID.');
            return;
        }

        localStorage.setItem('massTriggerClientId', clientId.trim());
        onReconnect(clientId.trim());
    };

    return (
        <div className='max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl'>
            <h1 className='text-2xl font-bold mb-4'>Reconectar Cliente</h1>

            <p className='text-gray-600 mb-4'>
                Informe o Client ID fornecido no cadastro inicial para reconectar sua conta.
            </p>

            <input
                className='w-full border rounded p-2 mb-3'
                placeholder='Digite seu Client ID'
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
            />

            {error && <p className='text-red-500 mb-3'>{error}</p>}

            <button onClick={handleReconnect} className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'>
                Reconectar
            </button>
        </div>
    );
}
