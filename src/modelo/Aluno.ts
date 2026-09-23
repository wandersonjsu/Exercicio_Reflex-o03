import { Tabela } from '../anotacao/Tabela'; // Verifique se o caminho do import está correto
import { SuperTabela } from './SuperTabela';

// Exemplo 1: Utilizando com um nome específico
@Tabela('tb_alunos')
export class Aluno extends SuperTabela {
    // ... os atributos e métodos da classe mantêm-se iguais
}