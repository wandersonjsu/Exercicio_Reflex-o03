import 'reflect-metadata';

// Assinaturas para aceitar a utilização com e sem parâmetros
export function Tabela(nomeDaTabela: string): ClassDecorator;
export function Tabela(target: Function): void;

// Implementação do decorador
export function Tabela(arg: string | Function): ClassDecorator | void {
    if (typeof arg === 'function') {
        // Utilizado sem parâmetros: @Tabela
        Reflect.defineMetadata('nomeTabela', arg.name, arg);
    } else {
        // Utilizado com nome específico: @Tabela('nome_personalizado')
        return function (target: Function) {
            Reflect.defineMetadata('nomeTabela', arg, target);
        };
    }
}