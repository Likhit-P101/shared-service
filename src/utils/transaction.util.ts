import { AsyncLocalStorage } from 'async_hooks';

// สร้าง instance ของ AsyncLocalStorage
export const asyncLocalStorage = new AsyncLocalStorage<Map<string, string>>();

// ฟังก์ชันสำหรับตั้งค่า transactionId
export function setTransactionId(transactionId: string | string[]) {
    const store = asyncLocalStorage.getStore();
    if (store) {
        store.set('transactionId', Array.isArray(transactionId) ? transactionId[0] : transactionId);
    }
}

// ฟังก์ชันสำหรับดึงค่า transactionId
export function getTransactionId(): string | undefined {
    const store = asyncLocalStorage.getStore();
    return store?.get('transactionId');
}
