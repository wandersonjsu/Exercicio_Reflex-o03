import 'reflect-metadata';

// Exercício 02 (mantido sem alterações): aceita @Tabela('nome') e @Tabela puro.
export function Tabela(nomeDaTabela: string): ClassDecorator;
export function Tabela(target: Function): void;

export function Tabela(arg: string | Function): ClassDecorator | void {
    if (typeof arg === 'function') {
        Reflect.defineMetadata('nomeTabela', arg.name, arg);
    } else {
        return function (target: Function) {
            Reflect.defineMetadata('nomeTabela', arg, target);
        };
    }
}
