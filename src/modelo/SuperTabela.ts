import 'reflect-metadata';

export abstract class SuperTabela {

    public getTableName(): string {
        const classeConstrutora = this.constructor;
        let nomeDaTabela = Reflect.getMetadata('nomeTabela', classeConstrutora);

        if (!nomeDaTabela) {
            nomeDaTabela = classeConstrutora.name;
        }

        return nomeDaTabela;
    }
}