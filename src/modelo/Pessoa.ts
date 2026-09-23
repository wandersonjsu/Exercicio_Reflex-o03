import { Tabela } from '../anotacao/Tabela';
import { SuperTabela } from './SuperTabela';

// Exemplo 2: Utilizando SEM um nome específico (vai assumir o nome da classe "Pessoa")
@Tabela
export class Pessoa extends SuperTabela {

}