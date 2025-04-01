// import fetch from "node-fetch";
import { getTransactionId } from './transaction.util';

export async function fetchWithTransaction(url: string, options: RequestInit = {}) {
    const transactionId = getTransactionId();
    const headers = {
        ...options.headers,
        'X-Transaction-Id': transactionId || '',
        'Content-Type': 'application/json'
    };

    return fetch(url, { ...options, headers });
}
