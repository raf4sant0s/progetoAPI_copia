# Guia Completo: Testando a API no Postman

Este guia prático mostra passo a passo como testar **todas as rotas** do Sistema de Gestão de Eventos usando o Postman.

> ⚠️ **Importante:** Sempre que o passo pedir um `Body`, certifique-se de selecionar a opção **`raw`** e mudar o menu dropdown de `Text` para **`JSON`** no Postman.

---

## 1. Fluxo de Autenticação (Acesso Público)

### 1.1 Registrar um novo usuário
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/register`
- **Body (JSON):**
```json
{
  "name": "Maria Silva",
  "email": "maria@teste.com",
  "password": "senhaSegura123"
}
```
- **Ação:** Clique em *Send*. Deve retornar status **201** e as informações do usuário.

### 1.2 Fazer Login (Gerar o Token)
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "maria@teste.com",
  "password": "senhaSegura123"
}
```
- **Ação:** Clique em *Send*. 
- **⚠️ PASSO CRÍTICO:** Na resposta, você verá uma propriedade chamada `"token"`. **Copie o valor desse token** (é um texto bem longo). Você precisará dele para todas as próximas rotas!

---

## Configurando a Autenticação no Postman (Para os próximos testes)

Para todas as rotas a partir do passo 2, você precisa configurar a autenticação:
1. Logo abaixo da barra de URL, clique na aba **Authorization**.
2. No menu **Type**, escolha **Bearer Token**.
3. No campo **Token** que aparecer do lado direito, cole o token que você copiou no passo 1.2.

---

## 2. Fluxo de Eventos (Requer Autenticação)

### 2.1 Criar um Evento
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/events`
- **Authorization:** Bearer Token (Token colado)
- **Body (JSON):**
```json
{
  "title": "Hackathon de Node.js",
  "description": "Um evento de 48 horas para construir APIs incríveis usando Express e MongoDB.",
  "date": "2026-12-15T09:00:00Z",
  "location": "São Paulo - SP",
  "maxParticipants": 100,
  "category": "workshop"
}
```
- **Ação:** Clique em *Send*. Anote o `_id` do evento criado na resposta, pois vamos usá-lo depois!

### 2.2 Listar todos os Eventos
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/events`
- **Authorization:** Bearer Token
- **Body:** Nenhum
- **Ação:** Clique em *Send*. Retornará uma lista com todos os eventos cadastrados.

### 2.3 Buscar um Evento Específico
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/events/COLE_O_ID_DO_EVENTO_AQUI`
- *(Exemplo: `http://localhost:3000/api/events/66415f3e2a9b...`)*
- **Authorization:** Bearer Token
- **Body:** Nenhum
- **Ação:** Clique em *Send*. Retornará apenas os dados desse evento.

### 2.4 Atualizar um Evento
> *Nota: Você só pode atualizar eventos que você mesmo criou.*
- **Método:** `PUT`
- **URL:** `http://localhost:3000/api/events/COLE_O_ID_DO_EVENTO_AQUI`
- **Authorization:** Bearer Token
- **Body (JSON):** *(envie apenas o que deseja alterar)*
```json
{
  "location": "Evento Online (Mudança de planos)"
}
```
- **Ação:** Clique em *Send*. O evento será modificado.

---

## 3. Fluxo de Inscrições (Requer Autenticação)

### 3.1 Inscrever-se em um Evento
- **Método:** `POST`
- **URL:** `http://localhost:3000/api/registrations`
- **Authorization:** Bearer Token
- **Body (JSON):**
```json
{
  "eventId": "COLE_O_ID_DO_EVENTO_AQUI"
}
```
- **Ação:** Clique em *Send*. Retornará status 201 confirmando sua inscrição. Anote o `_id` da inscrição criada.

### 3.2 Listar Minhas Inscrições
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/registrations/my`
- **Authorization:** Bearer Token
- **Body:** Nenhum
- **Ação:** Clique em *Send*. Mostrará todos os eventos nos quais você está inscrito.

### 3.3 Ver Participantes de um Evento
- **Método:** `GET`
- **URL:** `http://localhost:3000/api/registrations/event/COLE_O_ID_DO_EVENTO_AQUI`
- **Authorization:** Bearer Token
- **Body:** Nenhum
- **Ação:** Clique em *Send*. Listará todos os usuários inscritos no evento em questão.

### 3.4 Cancelar Inscrição
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/api/registrations/COLE_O_ID_DA_INSCRICAO_AQUI`
- *(Cuidado: Aqui é o ID da inscrição, não o ID do evento)*
- **Authorization:** Bearer Token
- **Body:** Nenhum
- **Ação:** Clique em *Send*. O status da inscrição mudará para "cancelada".

---

## 4. Deletar Evento (Passo Final)

### 4.1 Excluir o Evento
- **Método:** `DELETE`
- **URL:** `http://localhost:3000/api/events/COLE_O_ID_DO_EVENTO_AQUI`
- **Authorization:** Bearer Token
- **Body:** Nenhum
- **Ação:** Clique em *Send*. O evento será removido permanentemente do banco de dados.
