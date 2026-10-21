import 'reflect-metadata';
import { Restricoes } from './Coluna';

// Guardo as restrições numa chave separada ('restricoes'), indexadas pelo nome
// da propriedade. Assim a ordem dos decorators na propriedade não importa.
function registrar(alvo: object, propriedade: string | symbol, parcial: Restricoes) {
    const ctor = alvo.constructor;
    const atuais: Record<string, Restricoes> = Reflect.getMetadata('restricoes', ctor) ?? {};
    const chave = String(propriedade);
    Reflect.defineMetadata('restricoes', { ...atuais, [chave]: { ...atuais[chave], ...parcial } }, ctor);
}

export function TamanhoMaximo(max: number): PropertyDecorator {
    return (alvo, propriedade) => registrar(alvo, propriedade, { tamanhoMaximo: max });
}

export function Email(): PropertyDecorator {
    return (alvo, propriedade) => registrar(alvo, propriedade, { email: true });
}
