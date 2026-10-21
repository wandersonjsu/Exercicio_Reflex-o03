import { Tabela } from '../anotacao/Tabela';
import { Coluna } from '../anotacao/Coluna';
import { Email, TamanhoMaximo } from '../anotacao/Restricoes';
import { SuperTabela } from './SuperTabela';

@Tabela('tb_alunos')
export class Aluno extends SuperTabela {
    @Coluna({ nome: 'id_aluno', chavePrimaria: true })
    id!: number;

    @Coluna({ nome: 'nm_aluno', obrigatorio: true })
    @TamanhoMaximo(60)
    nome!: string;

    @Coluna({ nome: 'ds_email', obrigatorio: true })
    @Email()
    @TamanhoMaximo(80)
    email!: string;

    @Coluna({ nome: 'nr_idade' })
    idade?: number;
}
