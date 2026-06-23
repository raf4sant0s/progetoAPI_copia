# Sistema de Gestão (API REST) - Migração para MySQL

API REST em Node.js com persistência em banco de dados relacional MySQL (anteriormente MongoDB). Desenvolvida para gerenciar Categorias, Produtos, Clientes e Pedidos. A API inclui autenticação JWT, validação rigorosa de usuários e segurança contra SQL Injection via Prepared Statements.

## Tecnologias Utilizadas

- **Node.js & Express:** Framework base para construção da API REST.
- **MySQL & mysql2:** Sistema Gerenciador de Banco de Dados Relacional e driver com suporte a Promises.
- **Autenticação:** JSON Web Token (JWT) e BCrypt para hash de senhas.
- **Segurança:** Prepared Statements em todas as queries (contra SQL Injection) e `helmet` para headers HTTP seguros.

## Como Instalar e Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/raf4sant0s/projetoAPI_REST.git
   cd projetoAPI_REST
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   - Crie/edite o arquivo `.env` na raiz do projeto e configure suas credenciais do MySQL:
     ```env
     PORT=3000
     JWT_SECRET=sua_chave_secreta_aqui
     DB_HOST=127.0.0.1
     DB_USER=root
     DB_PASS=sua_senha_do_mysql
     DB_NAME=loja
     ```

4. **Prepare o Banco de Dados:**
   - Importe o script `loja.sql` fornecido no repositório para o seu servidor MySQL para criar as tabelas e dados iniciais.

5. **Inicie o Servidor:**
   - Para desenvolvimento (com hot-reload):
     ```bash
     npm run dev
     ```
   - Para produção:
     ```bash
     npm start
     ```

## Endpoints da API

A URL base padrão é: `http://localhost:3000/api`

### Metadados (Acesso Livre)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/versao` | Retorna a versão e o status da API (ex: `{"versao": "2.0.0", "status": "online"}`). |

### Autenticação (`/auth`)
| Método | Rota | Descrição | Requer Auth |
|---|---|---|---|
| POST | `/auth/register` | Cria uma nova conta de usuário. Enviar `email`, `password`. | Não |
| POST | `/auth/login` | Autentica um usuário e retorna um JWT. Enviar `email`, `password`. | Não |

### Rotas Protegidas de CRUD
*Todos os endpoints abaixo requerem o header: `Authorization: Bearer <seu_token>`*
*Qualquer tentativa de acesso sem um token válido ou com ID de usuário incorreto retornará `401 Unauthorized` ou `403 Forbidden`.*

#### Categorias (`/categorias`)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/categorias` | Lista todas as categorias. |
| GET | `/categorias/:id` | Busca detalhes de uma categoria. |
| POST | `/categorias` | Cria uma nova categoria. |
| PUT | `/categorias/:id` | Atualiza uma categoria existente. |
| DELETE | `/categorias/:id` | Remove uma categoria. |

#### Produtos (`/produtos`)
- O CRUD de Produtos (`GET`, `POST`, `PUT`, `DELETE` em `/produtos` e `/produtos/:id`) segue a mesma estrutura de Categorias.

#### Clientes (`/clientes`)
- O CRUD de Clientes (`GET`, `POST`, `PUT`, `DELETE` em `/clientes` e `/clientes/:id`) segue a mesma estrutura de Categorias.

#### Pedidos (`/pedidos`)
- O CRUD de Pedidos (`GET`, `POST`, `PUT`, `DELETE` em `/pedidos` e `/pedidos/:id`) segue a mesma estrutura de Categorias. A criação de pedidos suporta inserção simultânea dos itens do pedido.

## Estrutura do Projeto (Migrado)

```text
projetoAPI_REST/
├── src/
│   ├── config/          # Configuração do Pool de conexões MySQL (`database.js`)
│   ├── controllers/     # Lógica de negócio e validação (Auth, Categorias, Produtos, etc.)
│   ├── middlewares/     # Middlewares Express (`authMiddleware.js`)
│   ├── models/          # Queries SQL com Prepared Statements para cada entidade
│   ├── routes/          # Definição dos endpoints REST (Rotas privadas e públicas)
│   ├── app.js           # Configuração da instância do Express e registro das rotas
│   └── swagger.json     # Documentação da API
├── server.js            # Arquivo principal que inicia o servidor e testa a conexão DB
├── loja.sql             # Script do banco de dados relacional
├── .env                 # Variáveis de ambiente (não versionado)
├── package.json         # Dependências do projeto
└── README.md            # Esta documentação
```
