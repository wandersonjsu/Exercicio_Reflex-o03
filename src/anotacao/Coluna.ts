import 'reflect-metadata';

export interface OpcoesColuna {
    nome?: string;          // nome da coluna no banco (se vazio, usa o nome da propriedade)
    obrigatorio?: boolean;
    chavePrimaria?: boolean;
}

// Restrições extras, preenchidas por decorators como @TamanhoMaximo e @Email
export interface Restricoes {
    tamanhoMaximo?: number;
    email?: boolean;
}

export interface MetaColuna extends Restricoes {
    propriedade: string;
    coluna: string;
    tipo: string;           // vem do design:type ("String", "Number"...)
    obrigatorio: boolean;
    chavePrimaria: boolean;
}

export function Coluna(opcoes: OpcoesColuna = {}): PropertyDecorator {
    return (target, propriedade) => {
        const ctor = target.constructor;
        const existentes: MetaColuna[] = Reflect.getMetadata('colunas', ctor) ?? [];
        const tipo = Reflect.getMetadata('design:type', target, propriedade)?.name ?? 'String';

        // Crio um array novo (em vez de dar push) para uma subclasse não
        // alterar, sem querer, as colunas da classe pai.
        Reflect.defineMetadata('colunas', [
            ...existentes,
            {
                propriedade: String(propriedade),
                coluna: opcoes.nome ?? String(propriedade),
                obrigatorio: opcoes.obrigatorio ?? false,
                chavePrimaria: opcoes.chavePrimaria ?? false,
                tipo,
            } as MetaColuna,
        ], ctor);
    };
}

// Ponto único de leitura: junta as colunas com as restrições de cada uma.
// Repositório, validador e endpoint de metadados usam só esta função.
export function obterColunas(classe: Function): MetaColuna[] {
    const colunas: MetaColuna[] = Reflect.getMetadata('colunas', classe) ?? [];
    const restricoes: Record<string, Restricoes> = Reflect.getMetadata('restricoes', classe) ?? {};
    return colunas.map(c => ({ ...c, ...restricoes[c.propriedade] }));
}
