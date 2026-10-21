import { Tabela } from '../anotacao/Tabela';
import { Coluna } from '../anotacao/Coluna';
import { TamanhoMaximo } from '../anotacao/Restricoes';
import { SuperTabela } from './SuperTabela';

@Tabela // sem parâmetro: a tabela se chama "Pessoa"
export class Pessoa extends SuperTabela {
    @Coluna({ chavePrimaria: true })
    id!: number;

    @Coluna({ obrigatorio: true })
    @TamanhoMaximo(60)
    nome!: string;

    @Coluna({ obrigatorio: true })
    @TamanhoMaximo(11)
    cpf!: string;

    @Coluna()
    @TamanhoMaximo(15)
    telefone?: string;
}
