# TODO - Sistema de Controle de Oficinas - ELLP

## Requisitos Funcionais

### RF01: Cadastro de Professores e Tutores
- [x] Criar tabelas no banco de dados (Professores e Tutores) - Daniel
- [x] Implementar endpoints de CRUD no backend - Paolla
- [x] Criar componentes de formulário no frontend - Igor
- [x] Integrar frontend com backend - Igor, Paolla, Daniel

### RF02: Cadastro de Temas de Oficina
- [x] Criar tabela Temas no banco de dados - Daniel
- [x] Implementar endpoints de CRUD no backend - Paolla
- [x] Criar componentes de formulário no frontend - Igor
- [x] Integrar frontend com backend - Igor, Paolla, Daniel

### RF03: Cadastro de Oficinas
- [x] Criar tabela Oficinas no banco de dados - Daniel
- [x] Implementar endpoints de CRUD no backend - Paolla
- [x] Criar componentes de formulário no frontend - Igor
- [x] Integrar frontend com backend - Igor, Paolla, Daniel

### RF04: Cadastro de Alunos/as
- [x] Criar tabela Alunos no banco de dados - Daniel
- [x] Implementar endpoints de CRUD no backend - Paolla
- [x] Criar componentes de formulário no frontend - Igor
- [x] Integrar frontend com backend - Igor, Paolla, Daniel

### RF05: Geração e Arquivamento de Certificados
- [x] Criar tabela Certificados no banco de dados - Daniel
- [ ] Implementar geração de PDF - Paolla
- [x] Implementar endpoints para gerar certificados - Paolla
- [x] Criar interface de geração de certificados - Igor
- [x] Integrar frontend com backend - Igor, Paolla, Daniel

### RF06: Tela de Autenticação
- [x] Implementar tela de login - Igor
- [x] Integrar com sistema de autenticação - Paolla
- [x] Validar credenciais do Gerente de Oficinas - Paolla
- [x] Remover dependências do Manus - Todos

## Tarefas de Infraestrutura

- [x] Configurar banco de dados relacional (PostgreSQL/MySQL)
- [x] Implementar layout do dashboard - Igor
- [x] Criar componentes reutilizáveis - Igor
- [x] Remover todas as dependências do Manus
- [x] Traduzir comentários para português brasileiro
- [ ] Implementar testes unitários - Daniel, Paolla, Igor
- [ ] Documentar API - Paolla
- [ ] Criar guia de usuário - Igor

## Melhorias Futuras

- [ ] Adicionar filtros e busca nas listagens
- [ ] Implementar paginação nas tabelas
- [ ] Adicionar gráficos e estatísticas no dashboard
- [ ] Implementar sistema de notificações
- [ ] Adicionar exportação de dados (Excel, CSV)
- [ ] Implementar upload de fotos para perfis
- [ ] Adicionar histórico de alterações
- [ ] Implementar sistema de permissões por função

## Notas

- Distribuição de tarefas: Igor (Front-end), Paolla (Back-end/API), Daniel (Banco de Dados/Repositórios)
- Tecnologias: React.js (Front-end), Node.js + Express + tRPC (Back-end), MySQL/PostgreSQL (BD)
- Metodologia: Scrum com 2 Sprints
- Todos os arquivos devem ter comentários em português indicando o autor e a funcionalidade
- Projeto agora é independente do Manus e pode rodar localmente

## Bugs Reportados

- [x] Erro 404 ao clicar em "Temas" - Verificar roteamento e estrutura do DashboardLayout (CORRIGIDO)
- [x] Dependências do Manus causando problemas - Remover completamente (CORRIGIDO)
