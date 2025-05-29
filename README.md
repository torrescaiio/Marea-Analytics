# Marea Analytics - Documentação Completa

## 1. Repositório GitHub
- **URL**: https://github.com/torrescaiio/Marea-Analytics.git
- **Branch Principal**: master
- **Estrutura**: React/Vite application

## 2. Netlify
### Configurações de Build
- Build command: `npm install && npm run build`
- Publish directory: `dist`
- Base directory: "/"
- Functions directory: "netlify/functions"
- Node Version: 18

### Configuração do netlify.toml
```toml
[build]
command = "npm run build"
publish = "dist"
environment = { NODE_VERSION = "18", VITE_SHOULD_USE_HASH = "true" }

[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

## 3. Supabase
### Tabela Principal: `SalesData`
#### Colunas Principais:
- `data_fiscal`: Data da venda
- `nome_pdv`: Nome do ponto de venda
- `atendente`: Nome do garçom/atendente
- `grupo`: Categoria do produto
- `grupo_fixo`: Categoria fixa do produto
- `nome_item`: Nome do item vendido
- `quantidade`: Quantidade vendida
- `valor_total`: Valor total da venda

## 4. Funcionalidades Implementadas

### Layout Responsivo
- MobileLayout para dispositivos móveis
- Layout desktop otimizado
- Menu deslizante para filtros em mobile
- StatsCards em 2 colunas para mobile

### Relatórios
- Por Item (Ranking de Vendas)
- Por Categoria (com itens expandíveis)
- Crescimento de Itens (vs. Mês Anterior)
- Desempenho de Garçom (vs. Mês Anterior)

### Filtros
- Período (DateRange)
- PDV
- Garçom/Atendente
- Categorias

## 5. SEO e Metadados
- **Título**: Marea Analytics
- **Idioma**: pt-BR
- **Descrição**: Sistema de análise de vendas para restaurantes

## 6. Estrutura de Arquivos Principais
```
src/
├── components/
│   ├── DetailedSalesReport.tsx
│   ├── FilterPanel.tsx
│   ├── ExcelUpload.tsx
│   └── MobileLayout.tsx
├── hooks/
│   ├── useDetailedReports.ts
│   └── useFilterOptions.ts
├── contexts/
│   └── FilterContext.tsx
└── integrations/
    └── supabase/
        └── client.ts
```

## 7. Dependências Principais
```json
{
  "dependencies": {
    "@tanstack/react-query": "latest",
    "@supabase/supabase-js": "latest",
    "framer-motion": "latest",
    "lucide-react": "latest",
    "react": "latest",
    "react-dom": "latest",
    "tailwindcss": "latest",
    "vite": "latest"
  }
}
```

## 8. Fluxo de Dados
1. Os dados são carregados do Supabase através do hook `useDetailedReports`
2. Os filtros são gerenciados globalmente através do `FilterContext`
3. Os relatórios são atualizados automaticamente quando os filtros mudam
4. Os dados são processados e agrupados de acordo com o tipo de relatório selecionado
5. A interface atualiza em tempo real com os novos dados

## 9. Otimizações
- Implementado cache de 30 segundos para queries
- Lazy loading para componentes pesados
- Otimização de imagens e assets
- Animações suaves com Framer Motion

## 10. Segurança
- Todas as chamadas à API são feitas através do cliente Supabase
- Variáveis de ambiente configuradas corretamente
- Redirecionamentos seguros configurados no Netlify

---

> Este documento contém todas as informações necessárias para entender a estrutura e configuração do projeto Marea Analytics. Para iniciar um novo desenvolvimento ou dar continuidade ao projeto, utilize estas informações como referência principal.
