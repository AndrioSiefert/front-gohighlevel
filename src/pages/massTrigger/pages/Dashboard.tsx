import { useEffect, useState } from 'react';
import { getInstances, sendBroadcast } from '../services/api';

interface DashboardProps {
    clientId: string;
    onDisconnect: () => void;
}

interface Instance {
    id: string;
    name: string;
    connectionStatus: string;
}

export default function Dashboard({ clientId, onDisconnect }: DashboardProps) {
    const [instances, setInstances] = useState<Instance[]>([]);
    const [selectedInstance, setSelectedInstance] = useState('');
    const [tag, setTag] = useState('');
    const [message, setMessage] = useState('');
    const [loadingInstances, setLoadingInstances] = useState(true);
    const [sending, setSending] = useState(false);
    const [result, setResult] = useState('');

    useEffect(() => {
        const fetchInstances = async () => {
            try {
                const data = await getInstances(clientId);
                setInstances(data);
            } catch {
                setResult('❌ Erro ao buscar instâncias');
            } finally {
                setLoadingInstances(false);
            }
        };

        fetchInstances();
    }, [clientId]);

    const handleSend = async () => {
        if (!selectedInstance || !tag || !message) {
            setResult('Preencha todos os campos.');
            return;
        }

        setSending(true);
        try {
            const res = await sendBroadcast(clientId, {
                tag,
                message,
                instance: selectedInstance,
            });

            setResult(`✅ Enviado! Sucesso: ${res.success} | Falha: ${res.failed}`);
        } catch (err: unknown) {
            if (
                err &&
                typeof err === 'object' &&
                'response' in err &&
                (err as { response?: { data?: { error?: string } } }).response?.data?.error
            ) {
                setResult(`❌ Erro: ${(err as { response: { data: { error: string } } }).response.data.error}`);
            } else {
                setResult('❌ Erro: Falha no disparo');
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <div className='max-w-lg mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl'>
            <div className='flex justify-between items-center mb-4'>
                <h1 className='text-2xl font-bold'>Disparador de Mensagens</h1>

                <button
                    onClick={() => {
                        localStorage.removeItem('massTriggerClientId');
                        onDisconnect(); // chama a função passada pelo index.tsx
                    }}
                    className='text-sm text-red-600 hover:underline'
                >
                    Trocar Cliente
                </button>
            </div>

            {loadingInstances ? (
                <p>Carregando instâncias...</p>
            ) : instances.length === 0 ? (
                <p>⚠️ Nenhuma instância ativa encontrada.</p>
            ) : (
                <div className='mb-4'>
                    <label className='block mb-1 font-medium'>Instância</label>
                    <select
                        className='w-full border rounded p-2'
                        value={selectedInstance}
                        onChange={(e) => setSelectedInstance(e.target.value)}
                    >
                        <option value=''>Selecione uma instância</option>
                        {instances.map((inst) => (
                            <option key={inst.id} value={inst.name}>
                                {inst.name} ({inst.connectionStatus})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className='mb-3'>
                <label className='block mb-1 font-medium'>Tag</label>
                <input className='w-full border rounded p-2' value={tag} onChange={(e) => setTag(e.target.value)} />
            </div>

            <div className='mb-3'>
                <label className='block mb-1 font-medium'>Mensagem</label>
                <textarea
                    className='w-full border rounded p-2'
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </div>

            <button
                onClick={handleSend}
                disabled={sending || loadingInstances}
                className='w-full bg-green-600 text-white p-2 rounded hover:bg-green-700'
            >
                {sending ? 'Enviando...' : 'Enviar Mensagem'}
            </button>

            {result && <div className='mt-4 p-3 bg-gray-100 rounded'>{result}</div>}
        </div>
    );
}
