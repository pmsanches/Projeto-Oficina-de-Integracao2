import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core"

/**
 * Tabela principal de usuários para o fluxo de autenticação.
 * Estenda este arquivo com tabelas adicionais conforme seu produto cresce.
 * As colunas usam camelCase para corresponder aos campos do banco de dados e tipos gerados.
 */
export const users = mysqlTable("users", {
  /**
   * Chave primária substituta. Valor numérico auto-incrementado gerenciado pelo banco de dados.
   * Use isso para relações entre tabelas.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Identificador OAuth (openId) retornado do callback OAuth. Único por usuário. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert

// ========================================
// DANIEL: Tabelas do Sistema de Controle de Oficinas
// Descrição: Define todas as entidades do sistema (Tema, Oficina, Professor, Tutor, Aluno, Certificado)
// ========================================

/**
 * Tabela de Temas de Oficinas
 * Armazena os temas disponíveis para as oficinas
 */
export const temas = mysqlTable("temas", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  cargaHoraria: int("cargaHoraria").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
})

export type Tema = typeof temas.$inferSelect
export type InsertTema = typeof temas.$inferInsert

/**
 * Tabela de Professores
 * Armazena informações dos professores que ministram oficinas
 */
export const professores = mysqlTable("professores", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  cargo: varchar("cargo", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
})

export type Professor = typeof professores.$inferSelect
export type InsertProfessor = typeof professores.$inferInsert

/**
 * Tabela de Tutores
 * Armazena informações dos tutores que auxiliam nas oficinas
 */
export const tutores = mysqlTable("tutores", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
})

export type Tutor = typeof tutores.$inferSelect
export type InsertTutor = typeof tutores.$inferInsert

/**
 * Tabela de Alunos
 * Armazena informações dos alunos que participam das oficinas
 */
export const alunos = mysqlTable("alunos", {
  id: int("id").autoincrement().primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  email: varchar("email", { length: 255 }).notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
})

export type Aluno = typeof alunos.$inferSelect
export type InsertAluno = typeof alunos.$inferInsert

/**
 * Tabela de Oficinas
 * Armazena informações das oficinas oferecidas
 */
export const oficinas = mysqlTable("oficinas", {
  id: int("id").autoincrement().primaryKey(),
  titulo: varchar("titulo", { length: 255 }).notNull(),
  descricao: text("descricao"),
  temaId: int("temaId").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
})

export type Oficina = typeof oficinas.$inferSelect
export type InsertOficina = typeof oficinas.$inferInsert

/**
 * Tabela de Relacionamento: Oficinas e Professores (N:M)
 * Associa professores às oficinas que ministram
 */
export const oficinaProfessores = mysqlTable("oficina_professores", {
  id: int("id").autoincrement().primaryKey(),
  oficinaId: int("oficinaId").notNull(),
  professorId: int("professorId").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
})

export type OficinaProfessor = typeof oficinaProfessores.$inferSelect
export type InsertOficinaProfessor = typeof oficinaProfessores.$inferInsert

/**
 * Tabela de Relacionamento: Oficinas e Tutores (N:M)
 * Associa tutores às oficinas que auxiliam
 */
export const oficinaTutores = mysqlTable("oficina_tutores", {
  id: int("id").autoincrement().primaryKey(),
  oficinaId: int("oficinaId").notNull(),
  tutorId: int("tutorId").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
})

export type OficinaTutor = typeof oficinaTutores.$inferSelect
export type InsertOficinaTutor = typeof oficinaTutores.$inferInsert

/**
 * Tabela de Relacionamento: Oficinas e Alunos (N:M)
 * Associa alunos às oficinas que participam
 */
export const oficinaAlunos = mysqlTable("oficina_alunos", {
  id: int("id").autoincrement().primaryKey(),
  oficinaId: int("oficinaId").notNull(),
  alunoId: int("alunoId").notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
})

export type OficinaAluno = typeof oficinaAlunos.$inferSelect
export type InsertOficinaAluno = typeof oficinaAlunos.$inferInsert

/**
 * Tabela de Certificados
 * Armazena informações dos certificados gerados para os alunos
 */
export const certificados = mysqlTable("certificados", {
  id: int("id").autoincrement().primaryKey(),
  alunoId: int("alunoId").notNull(),
  oficinaId: int("oficinaId").notNull(),
  descricao: text("descricao"),
  cargaHoraria: int("cargaHoraria").notNull(),
  dataEmissao: timestamp("dataEmissao").defaultNow().notNull(),
  criadoEm: timestamp("criadoEm").defaultNow().notNull(),
  atualizadoEm: timestamp("atualizadoEm").defaultNow().onUpdateNow().notNull(),
})

export type Certificado = typeof certificados.$inferSelect
export type InsertCertificado = typeof certificados.$inferInsert
