import { obterColunas } from '../anotacao/Coluna';

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valida os dados recebidos usando só os metadados da classe.
// Devolve a lista de erros (vazia = tudo certo).
export function validar(classe: Function, dados: any): string[] {
    if (typeof dados !== 'object' || dados === null) {
        return ['Corpo da requisição inválido'];
    }

    const erros: string[] = [];

    for (const c of obterColunas(classe)) {
        if (c.chavePrimaria) continue; // o id é gerado pelo repositório

        const valor = dados[c.propriedade];
        const vazio = valor === undefined || valor === null || valor === '';

        if (vazio) {
            if (c.obrigatorio) erros.push(`O campo "${c.propriedade}" é obrigatório`);
            continue;
        }
        if (c.tipo === 'Number' && (typeof valor !== 'number' || !Number.isFinite(valor))) {
            erros.push(`O campo "${c.propriedade}" deve ser um número`);
            continue;
        }
        if (c.tipo === 'String' && typeof valor !== 'string') {
            erros.push(`O campo "${c.propriedade}" deve ser um texto`);
            continue;
        }
        if (c.tamanhoMaximo && String(valor).length > c.tamanhoMaximo) {
            erros.push(`O campo "${c.propriedade}" aceita no máximo ${c.tamanhoMaximo} caracteres`);
        }
        if (c.email && !REGEX_EMAIL.test(String(valor))) {
            erros.push(`O campo "${c.propriedade}" não é um e-mail válido`);
        }
    }
    return erros;
}
