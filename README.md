# Exercício 03 - Aplicando OO/Reflexão

**Aluno:*** Wanderson Almeida de Jesus
**Disciplina:**Programação Web ||

CRUD genérico em TypeScript/Node.js em que cada entidade é descrita **somente com decorators**. Um repositório, um validador e um controller genéricos leem esses metadados por reflexão (`reflect-metadata`). O frontend também não sabe os campos de antemão: ele os descobre chamando um endpoint de metadados.

## Como iniciar a aplicação

Pré-requisitos: **Node.js 18+** e **npm**.

```bash
git clone <URL-DO-REPOSITORIO>
cd <pasta-do-projeto>
git checkout <branch>        # se o projeto estiver em outra branch
npm install
npm start
```

Depois abra **http://localhost:3000** no navegador.

- Para usar outra porta: `PORT=4000 npm start` (no Windows PowerShell: `$env:PORT=4000; npm start`).
- Build de produção: `npm run build` e depois `npm run start:prod`.
- Os dados ficam **em memória**: ao reiniciar o servidor eles somem (de propósito, para o projeto rodar sem configurar banco). O SQL que seria executado é impresso no console.

## Rotas (valem para `alunos`, `pessoas` e `cursos`)

| Método | Rota | O que faz |
|---|---|---|
| GET | `/api/entidades` | Lista os CRUDs registrados |
| GET | `/api/{entidade}/metadados` | Campos, tipos, obrigatoriedade e restrições |
| GET | `/api/{entidade}` | Lista registros |
| GET | `/api/{entidade}/:id` | Busca um registro |
| POST | `/api/{entidade}` | Cria (valida antes) |
| PUT | `/api/{entidade}/:id` | Atualiza (valida antes) |
| DELETE | `/api/{entidade}/:id` | Remove |

Exemplo rápido:

```bash
curl localhost:3000/api/alunos/metadados
curl -X POST localhost:3000/api/alunos -H "Content-Type: application/json" \
     -d '{"nome":"Ana","email":"ana@exemplo.com","idade":20}'
```

## Onde apliquei Decorators e Reflexão

| Peça | Arquivo | Papel |
|---|---|---|
| `@Tabela` | `src/anotacao/Tabela.ts` | Nome da tabela (vem do Exercício 02, sem mudanças) |
| `@Coluna` | `src/anotacao/Coluna.ts` | Nome da coluna, obrigatório, chave primária. O **tipo** vem de `design:type`, sem eu precisar informar |
| `@TamanhoMaximo`, `@Email` | `src/anotacao/Restricoes.ts` | Decorators extras de validação |
| `SuperTabela` | `src/modelo/SuperTabela.ts` | Continua com `getTableName()` do Exercício 02 |

Exemplo de como ficou o modelo (`src/modelo/Aluno.ts`):

```ts
@Tabela('tb_alunos')
export class Aluno extends SuperTabela {
    @Coluna({ nome: 'id_aluno', chavePrimaria: true }) id!: number;
    @Coluna({ nome: 'nm_aluno', obrigatorio: true }) @TamanhoMaximo(60) nome!: string;
    @Coluna({ nome: 'ds_email', obrigatorio: true }) @Email() @TamanhoMaximo(80) email!: string;
    @Coluna({ nome: 'nr_idade' }) idade?: number;
}
```

## Onde removi código duplicado (refatoração)

- **`Repositorio<T>`** (`src/nucleo/Repositorio.ts`): um único repositório serve todas as entidades. Monta `SELECT/INSERT/UPDATE/DELETE` a partir das colunas e converte propriedade ⇄ coluna. Sem isso seria uma classe de repositório por entidade.
- **`registrarCrud()`** (`src/nucleo/CrudController.ts`): uma linha no `index.ts` registra as 6 rotas de uma entidade.
- **`validar()`** (`src/nucleo/Validador.ts`): uma validação para todas as entidades, baseada nos metadados.
- **`obterColunas()`**: ponto único de leitura dos metadados, usado por repositório, validador e endpoint.

## Integração backend ⇄ frontend

O `public/index.html` **não tem nenhum campo escrito**. Ele chama `/api/entidades` para criar as abas e `/api/{entidade}/metadados` para montar o formulário: `required` nos campos obrigatórios, `maxlength` quando há `@TamanhoMaximo`, `type="email"` quando há `@Email`, `type="number"` para campos numéricos. O backend revalida com **os mesmos metadados**, então as duas camadas nunca divergem.

## Como criar uma nova entidade (prova do reaproveitamento)

1. Criar a classe em `src/modelo/` estendendo `SuperTabela`, com `@Tabela` e `@Coluna`.
2. Adicionar `registrarCrud(roteador, 'minharota', MinhaClasse);` em `src/index.ts`.
3. Pronto: API, validação e tela já funcionam. O `Curso` foi feito exatamente assim.

## Estrutura

```
src/
  anotacao/   Tabela.ts, Coluna.ts, Restricoes.ts   (decorators)
  modelo/     SuperTabela.ts, Aluno.ts, Pessoa.ts, Curso.ts
  nucleo/     Repositorio.ts, Validador.ts, CrudController.ts, Roteador.ts
  index.ts    registro das entidades e servidor
public/       index.html (frontend genérico)
```

## Decisões que tomei

- Usei o módulo `http` do próprio Node em vez de Express, para o único pacote de runtime continuar sendo o `reflect-metadata`. Se preferir Express, só o `Roteador.ts` precisa mudar.
- Dados em memória em vez de banco, para a correção ser simples. O repositório já gera o SQL, então trocar por SQLite/MySQL é substituir o corpo de quatro métodos.

## Uso de Inteligência Artificial

Este exercício foi feito **com auxílio de IA (Claude, da Anthropic)**, e deixo isso registrado aqui de forma transparente.

**Como usei:** descrevi o enunciado e o que já tinha dos Exercícios 01 e 02 (`@Tabela`, `SuperTabela`, `Aluno`, `Pessoa`) e conversei com a IA sobre como transformá-los em um CRUD reaproveitável. A IA propôs a arquitetura (decorators + repositório genérico + endpoint de metadados), escreveu a primeira versão do código e a testou em um ambiente de execução (servidor + requisições a todas as rotas).

**O que é da IA e o que é meu:**
- IA: proposta de arquitetura, geração do código, testes das rotas.

- Meu: o enunciado e os exercícios anteriores sobre os quais tudo foi construído, a escolha de manter o projeto sem dependências além do `reflect-metadata`, e a revisão do resultado.

