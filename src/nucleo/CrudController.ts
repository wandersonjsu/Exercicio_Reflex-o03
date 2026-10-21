import { obterColunas } from '../anotacao/Coluna';
import { SuperTabela } from '../modelo/SuperTabela';
import { Repositorio } from './Repositorio';
import { ErroHttp, Roteador } from './Roteador';
import { validar } from './Validador';

function lerId(texto: string): number {
    const id = Number(texto);
    if (!Number.isInteger(id)) throw new ErroHttp(400, 'Id inválido');
    return id;
}

// Esta função substitui o CRUD que antes eu teria que escrever uma vez por
// entidade. Uma chamada registra as 6 rotas de qualquer classe decorada.
export function registrarCrud<T extends SuperTabela>(
    roteador: Roteador, rota: string, classe: new () => T
) {
    const repo = new Repositorio(classe);
    const base = `/api/${rota}`;
    roteador.registrarEntidade({ rota, tabela: new classe().getTableName() });

    // Endpoint de metadados: o frontend monta o formulário a partir dele.
    // (registrado antes de /:id para "metadados" não ser confundido com um id)
    roteador.adicionar('GET', `${base}/metadados`, () => ({
        status: 200,
        corpo: {
            rota,
            tabela: new classe().getTableName(),
            colunas: obterColunas(classe).map(({ coluna, ...paraFront }) => paraFront), // nome da coluna do banco fica só no back
        },
    }));

    roteador.adicionar('GET', base, () => ({ status: 200, corpo: repo.listar() }));

    roteador.adicionar('GET', `${base}/:id`, ({ params }) => {
        const item = repo.buscar(lerId(params.id));
        return item ? { status: 200, corpo: item } : { status: 404, corpo: { erro: 'Não encontrado' } };
    });

    roteador.adicionar('POST', base, ({ corpo }) => {
        const erros = validar(classe, corpo);
        if (erros.length) return { status: 400, corpo: { erros } };
        return { status: 201, corpo: repo.inserir(corpo) };
    });

    roteador.adicionar('PUT', `${base}/:id`, ({ params, corpo }) => {
        const erros = validar(classe, corpo);
        if (erros.length) return { status: 400, corpo: { erros } };
        const item = repo.atualizar(lerId(params.id), corpo);
        return item ? { status: 200, corpo: item } : { status: 404, corpo: { erro: 'Não encontrado' } };
    });

    roteador.adicionar('DELETE', `${base}/:id`, ({ params }) =>
        repo.remover(lerId(params.id)) ? { status: 204 } : { status: 404, corpo: { erro: 'Não encontrado' } });
}
