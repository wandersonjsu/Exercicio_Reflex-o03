import { Tabela } from '../anotacao/Tabela';
import { Coluna } from '../anotacao/Coluna';
import { TamanhoMaximo } from '../anotacao/Restricoes';
import { SuperTabela } from './SuperTabela';

// Terceira entidade, criada só para provar o reaproveitamento:
// foi só escrever esta classe e uma linha no index.ts.
@Tabela('tb_cursos')
export class Curso extends SuperTabela {
    @Coluna({ nome: 'id_curso', chavePrimaria: true })
    id!: number;

    @Coluna({ nome: 'nm_curso', obrigatorio: true })
    @TamanhoMaximo(50)
    nome!: string;

    @Coluna({ nome: 'nr_carga_horaria', obrigatorio: true })
    cargaHoraria!: number;
}
