# Contexto do Frontend (saude-front)

Este documento detalha a arquitetura, tecnologias e estrutura do projeto frontend `saude-front`.

## 1. Visão Geral e Stack Tecnológica

O projeto é uma aplicação Single Page Application (SPA) construída com as seguintes tecnologias principais:

- **Framework Core:** React 19 (com React DOM).
- **Linguagem:** TypeScript, garantindo tipagem estática e maior segurança no desenvolvimento.
- **Build Tool / Bundler:** Vite, proporcionando um ambiente de desenvolvimento rápido e HMR (Hot Module Replacement) eficiente.
- **Estilização e Componentes Visuais:** Material UI (MUI v5) utilizando `@emotion/react` e `@emotion/styled`.

## 2. Principais Dependências e Bibliotecas

Além do core do React e MUI, a aplicação utiliza diversas bibliotecas para resolver problemas específicos:

- **Roteamento:** `react-router-dom` (v7) para navegação no lado do cliente.
- **Formulários e Validação:** 
  - `react-hook-form` para gerenciamento de estado de formulários.
  - `@hookform/resolvers` integrado com `zod` para validação de esquemas e dados de entrada.
- **Comunicação HTTP:** `axios` para consumo das APIs do backend.
- **Gráficos e Visualização de Dados:** `recharts` para exibição de gráficos e métricas.
- **Tabelas de Dados:** `@mui/x-data-grid` para listagem avançada de dados (como lista de pacientes e histórico).
- **Feedback Visual (Alertas):** `sweetalert2` para modais e alertas amigáveis.
- **Ícones:** `lucide-react` para ícones consistentes em toda a interface.
- **Renderização de Markdown:** `react-markdown` para exibição de conteúdos ricos ou resultados da predição/LLM.

## 3. Estrutura de Diretórios (`src/`)

A organização do código-fonte segue um padrão modular baseado em responsabilidades:

- **`components/`**: Contém componentes React reutilizáveis de interface. Exemplo: `Dashboard.tsx`.
- **`pages/`**: Contém as telas principais da aplicação, que são mapeadas para as rotas. 
  - `DashboardHome.tsx`: Tela inicial com visão geral.
  - `PatientList.tsx`: Listagem de pacientes cadastrados.
  - `PatientForm.tsx`: Formulário para criação e edição de pacientes.
  - `NewPrediction.tsx`: Tela dedicada para realizar novas predições baseadas nos dados de saúde.
  - `HistoryPage.tsx`: Histórico de predições realizadas.
  - `PredictionPage.tsx`: Tela de detalhes de uma predição específica.
- **`layouts/`**: Estruturas de layout da aplicação.
  - `MainLayout.tsx`: Layout principal que envolve as páginas (contém barra de navegação/menu e o contêiner central).
- **`services/`**: Serviços responsáveis pelas chamadas HTTP à API.
  - `api.ts`: Configuração base do Axios (interceptors, baseURL, etc).
  - `patient.service.ts`: Requisições relacionadas aos pacientes.
  - `prediction.service.ts`: Requisições para os endpoints de predição e IA.
- **`store/`**: Gerenciamento de estado da aplicação.
  - Atualmente, destaca-se o uso do `historyStore.ts`, que utiliza o `localStorage` do navegador para armazenar temporariamente ou localmente o histórico de predições realizadas, sem depender de uma biblioteca de estado complexa como Redux.
- **`types/`**: Definições de tipos e interfaces globais do TypeScript (ex: `api.ts`).
- **`styles/`**: Configurações de estilização global e temas.
  - `theme.ts`: Definição do tema customizado do Material UI (cores, tipografia, etc).
- **`utils/`**: Funções utilitárias diversas.
  - `formatters.ts`: Máscaras e formatadores (CPF, datas, moeda, etc).

## 4. Configuração de Roteamento

O roteamento é configurado no arquivo `App.tsx` utilizando `BrowserRouter` e `Routes`. Todas as rotas estão encapsuladas dentro do `MainLayout`:

- `/` -> `DashboardHome`
- `/pacientes` -> `PatientList`
- `/pacientes/novo` -> `PatientForm` (Criação)
- `/pacientes/:id` -> `PatientForm` (Edição)
- `/predicao/nova` -> `NewPrediction`
- `/history` -> `HistoryPage`

## 5. Scripts Disponíveis (package.json)

- `npm run dev`: Inicia o servidor de desenvolvimento via Vite.
- `npm run build`: Executa o TypeScript compiler e faz o build de produção com Vite.
- `npm run lint`: Roda o ESLint no código.
- `npm run preview`: Previsualiza o build de produção localmente.

## 6. Observações Arquiteturais

1. **Estado Simples vs Global:** A aplicação aparenta utilizar estado local do React para gerenciar formulários (via React Hook Form) e `localStorage` (via `historyStore.ts`) para persistência de dados leves. Não há bibliotecas pesadas de gerenciamento de estado global.
2. **Design System:** O uso forte do Material UI sugere que os componentes seguem as diretrizes do Material Design, mas adaptados através do arquivo de tema (`theme.ts`).
3. **Padrão de Formulários:** O uso conjunto do Zod com React Hook Form garante que a validação dos dados (como CPF, datas e campos obrigatórios) ocorra de forma performática e strongly-typed antes da submissão à API.
