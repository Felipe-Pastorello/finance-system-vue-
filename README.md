# FinTrack — Frontend Vue 3

Interface web para a [fintrack-api](https://github.com/GuiMarobo/fintrack-api), construída com Vue 3 + Vite + Vue Router + Pinia.

## Estrutura do projeto

```
src/
├── assets/
│   └── main.css              # Design system global (variáveis CSS, reset)
├── components/
│   ├── layout/
│   │   ├── AppLayout.vue     # Shell com sidebar (usado por rotas autenticadas)
│   │   └── AuthLayout.vue    # Layout de duas colunas (Login / Register)
│   └── ui/
│       ├── AppButton.vue     # Botão reutilizável (primary | ghost | danger)
│       ├── AppField.vue      # Campo de formulário (input / select)
│       ├── AppModal.vue      # Modal com Teleport + Transition
│       └── AppToast.vue      # Notificação flutuante
├── router/
│   └── index.js              # Vue Router + guards de autenticação
├── stores/
│   ├── auth.js               # Pinia: token JWT + dados do usuário
│   ├── accounts.js           # Pinia: CRUD de contas
│   └── transactions.js       # Pinia: CRUD de transações
└── views/
    ├── LoginView.vue          # POST /auth/login
    ├── RegisterView.vue       # POST /auth/register
    ├── DashboardView.vue      # Visão geral com gráfico
    ├── AccountsView.vue       # GET|POST|PUT|DELETE /accounts
    ├── TransactionsView.vue   # GET|POST|PUT|DELETE /transactions (com filtros)
    └── ProfileView.vue        # GET|PUT|PATCH|DELETE /users/me
```

## Instalação e execução

```bash
npm install
npm run dev
```

## Integrando com a API real

Os dados mock estão nos stores (`src/stores/`).  
Substitua os comentários `// Substitua por: ...` pelas chamadas reais usando `fetch` ou `axios`, passando o token JWT no header:

```js
Authorization: Bearer <token>
```

O token é salvo automaticamente no `localStorage` pelo `useAuthStore` após o login.
