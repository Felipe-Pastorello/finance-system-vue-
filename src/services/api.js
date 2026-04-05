const BASE_URL = 'http://localhost:8080'

function getToken() {
  return localStorage.getItem('ft_token')
}

function buildHeaders(withAuth = true) {
  const h = { 'Content-Type': 'application/json' }
  if (withAuth) h['Authorization'] = `Bearer ${getToken()}`
  return h
}

/**
 * Função central de requisição.
 *
 * Usa res.text() antes de tentar JSON para nunca quebrar em responses
 * com body vazio (DELETE retorna 204 ou 200 sem body conforme o Swagger).
 */
async function request(method, path, body = null, withAuth = true) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: buildHeaders(withAuth),
    body: body ? JSON.stringify(body) : null,
  })

  // Lê como texto primeiro — nunca falha em body vazio
  const text = await res.text()
  const data = text ? JSON.parse(text) : null

  if (!res.ok) {
    const msg = data?.message || data?.error || `Erro ${res.status}`
    throw new Error(msg)
  }

  return data   // null para DELETE/204 sem body
}

export const api = {
  // ── Auth ────────────────────────────────────────────────────────────
  // POST /auth/login    → { token }
  login: (email, password) =>
    request('POST', '/auth/login', { email, password }, false),

  // POST /auth/register → { message }
  register: (name, email, password) =>
    request('POST', '/auth/register', { name, email, password }, false),

  // ── Usuário ─────────────────────────────────────────────────────────
  // GET    /users/me → { id, name, email }
  getMe: () => request('GET', '/users/me'),

  // PUT    /users/me → { id, name, email }
  // Swagger: body aceita { name, email } (campos mínimos)
  updateMe: (data) => request('PUT', '/users/me', data),

  // PATCH  /users/me → { id, name, email }
  // Swagger: body é Map<String,String> — ex: { "password": "nova" }
  patchMe: (data) => request('PATCH', '/users/me', data),

  // DELETE /users/me → 200/204 sem body
  deleteMe: () => request('DELETE', '/users/me'),

  // ── Contas ──────────────────────────────────────────────────────────
  // GET /accounts?page=0&size=100 → Page<AccountResponse>
  getAccounts: (page = 0, size = 100) =>
    request('GET', `/accounts?page=${page}&size=${size}`),

  // POST /accounts
  // Swagger body: { bankName, accountType, balance }
  createAccount: (data) => request('POST', '/accounts', data),

  // PUT /accounts/{id}
  // Swagger body: { bankName, accountType, balance }  (transactions[] opcional)
  updateAccount: (id, data) => request('PUT', `/accounts/${id}`, data),

  // DELETE /accounts/{id} → 200/204 sem body
  deleteAccount: (id) => request('DELETE', `/accounts/${id}`),

  // ── Transações ──────────────────────────────────────────────────────
  // GET /transactions?page=0&size=100 → Page<TransactionResponse>
  getTransactions: (page = 0, size = 100) =>
    request('GET', `/transactions?page=${page}&size=${size}`),

  // POST /transactions
  // Swagger body: { description, amount, type, date, category, account: { id } }
  // Obs: Swagger omite "account" na UI mas a entidade exige @NotNull account
  createTransaction: (data) => request('POST', '/transactions', data),

  // PUT /transactions/{id}
  // Swagger body: { description, amount, type, date, category }  ← sem account!
  updateTransaction: (id, data) => request('PUT', `/transactions/${id}`, data),

  // DELETE /transactions/{id} → 200/204 sem body
  deleteTransaction: (id) => request('DELETE', `/transactions/${id}`),

  // GET /transactions/report?mes=4&ano=2026 → { mes, ano, totalEntradas, totalDespesas, saldo, totalTransacoes }
  getReport: (mes, ano) =>
    request('GET', `/transactions/report?mes=${mes}&ano=${ano}`),
}
