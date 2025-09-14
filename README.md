# 📚 Sistema de Controle de Oficinas - ELLP

Este projeto contempla o desenvolvimento de uma plataforma de controle de oficinas vinculada ao projeto de Extensão ELLP - Ensino Lúdico de Lógica de Programação. O sistema permitirá o gerenciamento completo das oficinas, temas, participantes, professores e emissão de certificados.

---

## 🎯 Objetivo

Criar uma plataforma web para que o Gerente de Oficinas possa cadastrar, gerenciar e emitir relatórios e certificados de forma centralizada e segura.

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
  - 📌 Tecnologia: React.js  
  - 📌 Linguagem: JavaScript

- *Back:*  
  - 📌 Framework: Spring Boot  
  - 📌 Linguagem: Java  
  - 📌 IDE sugeridas: NetBeans ou Eclipse

- *BD:*  
  - Banco de Dados relacional (a definir)

---

## 🧪 Estratégia de Testes

A estratégia de automação de testes será baseada em *Testes Unitários*, focando na validação de entradas e saídas:

- Validação de formatos (Telefone, E-mail, Datas etc.)
- Garantia de integridade dos dados manipulados nas camadas

