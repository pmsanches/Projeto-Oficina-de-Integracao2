# 📚 Sistema de Controle de Oficinas - ELLP

Este projeto contempla o desenvolvimento de uma plataforma de controle de oficinas vinculada ao projeto de Extensão ELLP - Ensino Lúdico de Lógica de Programação. O sistema permitirá o gerenciamento completo das oficinas, temas, participantes, professores e emissão de certificados.

---

## 🎯 Objetivo

Criar uma plataforma web para que o Gerente de Oficinas possa cadastrar, gerenciar e emitir relatórios e certificados de forma centralizada e segura.

Nosso Cronograma: https://trello.com/b/aP1XkLUb/cronogramacontrole-de-oficinas
---

## ✅ Funcionalidades (Requisitos Funcionais)

- RF01: Cadastro de Professores e Tutores  
  - Informações: Nome, Cargo, Telefone e E-mail

- RF02: Cadastro de Temas de Oficina  
  - Informações: Título, Descrição, Carga Horária

- RF03: Cadastro de Oficinas  
  - Informações: Título, Descrição, Tema(s), Professor(es), Tutor(es) e Alunos/as Participantes

- RF04: Cadastro de Alunos/as nas Oficinas  
  - Informações: Nome, Telefone, E-mail

- RF05: Geração e arquivamento de Certificados  
  - Informações no certificado: Nome do(a) aluno(a), Oficina, Descrição e Carga Horária

- RF06: Tela de Autenticação para Gerente de Oficinas  
  - Requer: Identificação e chave de acesso

---

## 🧱 Arquitetura do Sistema

O sistema será baseado na *Arquitetura em Camadas*, dividido em:

- *Front:*  
  - 📌 Tecnologia: Next.js com React e TypeScript
  *Back:* 
  - 📌 Backend: API Routes do Next.js
  - 📌 IDE: Vscode
  
   *BD:*  
  - Banco de Dados PostgreSQL (via Docker)

  *Estilizacao:*
   - Tailwind CSS

## Credenciais de Acesso

- **Email**: admin@ellp.com
- **Senha**: admin123
---

## Diagramas 

## MER
<img width="555" height="728" alt="MER" src="https://github.com/user-attachments/assets/1330dacf-917f-4e3a-8606-aaff7a575e00" />


## Diagrama de Atividades
<img width="416" height="493" alt="Diagrama de Atividade – Fluxo de Geração de Certificado" src="https://github.com/user-attachments/assets/834df47c-4076-4968-b6da-b7ffa0028aa2" />


## Diagrama de Casos de Uso
<img width="769" height="531" alt="Casos de uso_controle de oficina" src="https://github.com/user-attachments/assets/58602c9a-ad41-41a0-b6c5-e52f1a3ad8fa" />


## Diagramad de Classes
<img width="566" height="441" alt="Classes" src="https://github.com/user-attachments/assets/cc8a119b-50aa-40ff-8d75-c9bbe0eeaab5" />


## Diagrama de Componentes
<img width="574" height="563" alt="Componentes" src="https://github.com/user-attachments/assets/b74a0db4-9534-468e-a397-32741b20e1dd" />


---

## 🧪 Estratégia de Testes

A estratégia de automação de testes será baseada em *Testes Unitários*, focando na validação de entradas e saídas:

- Validação de formatos (Telefone, E-mail, Datas etc.)
- Garantia de integridade dos dados manipulados nas camadas
- Distribuição de tarefas: Nos ajudamos em tudo(Igor, Paolla). Um outro membro desistiu.
- Metodologia: Scrum com 2 Sprints

## Link para o vídeo de demosntração:
https://youtu.be/ZIeDRUkzIx4
