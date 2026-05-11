# Sistema de Gestão de Eventos API

API REST em Node.js com persistência em MongoDB para gestão de eventos, participantes e inscrições. Desenvolvido com foco em segurança, autenticação de usuários e boas práticas de versionamento.

## 🚀 Tecnologias Utilizadas

- **Node.js & Express:** Framework base para construção da API REST.
- **MongoDB & Mongoose:** Banco de dados NoSQL e ODM para modelagem e persistência.
- **Autenticação:** JSON Web Token (JWT) e BCrypt para hash de senhas.
- **Segurança:** `helmet` para headers de segurança e `express-mongo-sanitize` contra NoSQL Injection.

## 📦 Como Instalar e Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/raf4sant0s/projetoAPI_REST.git
   cd sistema-gestao-eventos
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   - Copie o arquivo `.env.example` para `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edite o arquivo `.env` e configure suas variáveis:
     ```env
     PORT=3000
     MONGODB_URI=mongodb://localhost:27017/gestao-eventos
     JWT_SECRET=sua_chave_secreta_super_segura
     ```
   - *Nota: É necessário ter o MongoDB rodando localmente na porta 27017 ou atualizar a string de conexão para um cluster MongoDB Atlas.*

4. **Inicie o Servidor:**
   - Para desenvolvimento (com hot-reload):
     ```bash
     npm run dev
     ```
   - Para produção:
     ```bash
     npm start
     ```

## 🗺️ Endpoints da API

A URL base padrão é: `http://localhost:3000/api`

### 🔐 Autenticação (`/auth`)
| Método | Rota | Descrição | Requer Auth |
|---|---|---|---|
| POST | `/auth/register` | Cria uma nova conta de usuário. Enviar `name`, `email`, `password`. | Não |
| POST | `/auth/login` | Autentica um usuário e retorna um JWT. Enviar `email`, `password`. | Não |

### 📅 Eventos (`/events`)
*Todos os endpoints abaixo requerem o header: `Authorization: Bearer <seu_token>`*

| Método | Rota | Descrição |
|---|---|---|
| POST | `/events` | Cria um novo evento. |
| GET | `/events` | Lista todos os eventos cadastrados. |
| GET | `/events/:id` | Busca detalhes de um evento específico. |
| PUT | `/events/:id` | Atualiza um evento (apenas o organizador pode realizar). |
| DELETE | `/events/:id` | Remove um evento (apenas o organizador pode realizar). |

### 🎟️ Inscrições (`/registrations`)
*Todos os endpoints abaixo requerem o header: `Authorization: Bearer <seu_token>`*

| Método | Rota | Descrição |
|---|---|---|
| POST | `/registrations` | Inscreve o usuário autenticado em um evento. Enviar `eventId`. |
| GET | `/registrations/my` | Lista todas as inscrições do usuário autenticado. |
| GET | `/registrations/event/:eventId` | Lista todos os participantes inscritos em um evento específico. |
| DELETE | `/registrations/:id` | Cancela uma inscrição. |

## 🏗️ Estrutura do Projeto

```text
sistema-gestao-eventos/
├── src/
│   ├── config/          # Configuração de banco de dados
│   ├── controllers/     # Lógica de negócio de cada rota
│   ├── middlewares/     # Middlewares Express (Auth, Sanitização)
│   ├── models/          # Schemas do Mongoose (Event, Registration, User)
│   ├── routes/          # Definição dos endpoints REST
│   └── app.js           # Configuração da instância do Express
├── server.js            # Arquivo principal que inicia o servidor
├── .env.example         # Exemplo de variáveis de ambiente
├── .gitignore           # Arquivos e diretórios ignorados pelo Git
├── package.json         # Dependências e scripts do projeto
└── README.md            # Esta documentação
```

## 🌿 Versionamento (GitFlow)

O desenvolvimento deste projeto seguiu o modelo GitFlow:
- `main`: Código de produção.
- `develop`: Código em desenvolvimento/integração.
- `feature/*`: Branches dedicadas para criação de novas funcionalidades (ex: `feature/user-auth`, `feature/event-crud`).
