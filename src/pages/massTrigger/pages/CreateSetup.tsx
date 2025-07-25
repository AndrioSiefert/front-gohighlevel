import { useState } from 'react';
import { createClient } from '../services/api';

interface SetupProps {
    onRegister: (clientId: string) => void;
}

export default function Setup({ onRegister }: SetupProps) {
    const [form, setForm] = useState({
        chatwootToken: '',
        chatwootAccountId: '',
        evolutionUrl: '',
        clientId: '',
    });

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await createClient({
                chatwootToken: form.chatwootToken,
                chatwootAccountId: form.chatwootAccountId,
                evolutionUrl: form.evolutionUrl,
                clientId: form.clientId || undefined,
            });

            localStorage.setItem('massTriggerClientId', res.clientId);
            onRegister(res.clientId);
            setResult(`✅ Cliente cadastrado com ID: ${res.clientId}`);
        } catch (err: any) {
            setResult(`❌ Erro: ${err.response?.data?.error || 'Falha no cadastro'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='max-w-md mx-auto mt-10 bg-white p-6 shadow-lg rounded-xl'>
            <h1 className='text-2xl font-bold mb-4'>Cadastrar Cliente</h1>

            {['chatwootToken', 'chatwootAccountId', 'evolutionUrl', 'clientId'].map((field) => (
                <div key={field} className='mb-3'>
                    <label className='block font-medium'>{field}</label>
                    <input
                        name={field}
                        value={form[field as keyof typeof form]}
                        onChange={handleChange}
                        className='w-full border rounded p-2'
                    />
                </div>
            ))}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className='w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700'
            >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
            </button>

            {result && <div className='mt-4 p-3 bg-gray-100 rounded'>{result}</div>}
        </div>
    );
}
