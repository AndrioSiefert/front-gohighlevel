import http from '../../../http';

export async function createClient(data: {
    chatwootToken: string;
    chatwootAccountId: string;
    evolutionUrl: string;
    clientId?: string;
}) {
    const res = await http.post('/init', data);
    return res.data;
}

export async function getInstances(clientId: string) {
    const res = await http.get('/instances', {
        headers: { 'x-client-id': clientId },
    });
    return res.data;
}

export async function sendBroadcast(
    clientId: string,
    data: {
        tag: string;
        message: string;
        instance: string;
    },
) {
    const res = await http.post('/broadcast', data, {
        headers: { 'x-client-id': clientId },
    });
    return res.data;
}
