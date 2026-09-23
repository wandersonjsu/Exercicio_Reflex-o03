export interface ObjectWithColor {
    cor: string;
}

// Type Guard para verificar em tempo de execução
export function isObjectWithColor(obj: any): obj is ObjectWithColor {
    return 'cor' in obj;
}
