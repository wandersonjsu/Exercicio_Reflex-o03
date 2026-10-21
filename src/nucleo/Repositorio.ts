import { MetaColuna, obterColunas } from '../anotacao/Coluna';
import { SuperTabela } from '../modelo/SuperTabela';

// Repositório genérico: serve para QUALQUER classe que estenda SuperTabela e
// tenha @Coluna. Os dados ficam em memória (Map), mas o SQL que rodaria num
// banco de verdade é montado por reflexão e mostrado no console.
export class Repositorio<T extends SuperTabela> {
    private linhas = new Map<number, Record<string, unknown>>(); // chave = id
    private sequencia = 1;
    private colunas: MetaColuna[];
    private pk: MetaColuna;
    private tabela: string;

    constructor(classe: new () => T) {
        this.colunas = obterColunas(classe);
        const pk = this.colunas.find(c => c.chavePrimaria);
        if (!pk) throw new Error(`${classe.name} precisa de uma coluna com chavePrimaria: true`);
        this.pk = pk;
        this.tabela = new classe().getTableName();
    }

    // ---- geração de SQL (tudo vem dos metadados) ----
    private semPk() { return this.colunas.filter(c => !c.chavePrimaria); }

    gerarSelect(porId = false): string {
        const sql = `SELECT ${this.colunas.map(c => c.coluna).join(', ')} FROM ${this.tabela}`;
        return porId ? `${sql} WHERE ${this.pk.coluna} = ?` : sql;
    }
    gerarInsert(): string {
        const cols = this.semPk();
        return `INSERT INTO ${this.tabela} (${cols.map(c => c.coluna).join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`;
    }
    gerarUpdate(): string {
        return `UPDATE ${this.tabela} SET ${this.semPk().map(c => `${c.coluna} = ?`).join(', ')} WHERE ${this.pk.coluna} = ?`;
    }
    gerarDelete(): string {
        return `DELETE FROM ${this.tabela} WHERE ${this.pk.coluna} = ?`;
    }

    // ---- conversão propriedade <-> coluna ----
    private paraLinha(obj: any): Record<string, unknown> {
        return Object.fromEntries(this.colunas.map(c => [c.coluna, obj[c.propriedade] ?? null]));
    }
    private deLinha(linha: Record<string, unknown>): Record<string, unknown> {
        return Object.fromEntries(this.colunas.map(c => [c.propriedade, linha[c.coluna]]));
    }
    private log(sql: string, valores: unknown[] = []) {
        console.log(`[SQL] ${sql}`, valores.length ? valores : '');
    }

    // ---- operações do CRUD ----
    listar() {
        this.log(this.gerarSelect());
        return [...this.linhas.values()].map(l => this.deLinha(l));
    }

    buscar(id: number) {
        this.log(this.gerarSelect(true), [id]);
        const linha = this.linhas.get(id);
        return linha ? this.deLinha(linha) : undefined;
    }

    inserir(dados: any) {
        const id = this.sequencia++;
        const linha = this.paraLinha({ ...dados, [this.pk.propriedade]: id });
        this.log(this.gerarInsert(), this.semPk().map(c => linha[c.coluna]));
        this.linhas.set(id, linha);
        return this.deLinha(linha);
    }

    atualizar(id: number, dados: any) {
        if (!this.linhas.has(id)) return undefined;
        const linha = this.paraLinha({ ...dados, [this.pk.propriedade]: id });
        this.log(this.gerarUpdate(), [...this.semPk().map(c => linha[c.coluna]), id]);
        this.linhas.set(id, linha);
        return this.deLinha(linha);
    }

    remover(id: number): boolean {
        this.log(this.gerarDelete(), [id]);
        return this.linhas.delete(id);
    }
}
