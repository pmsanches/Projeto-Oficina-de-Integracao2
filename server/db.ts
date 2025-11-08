import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, temas, professores, tutores, alunos, oficinas, certificados } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ========================================
// DANIEL: Helpers de Query para Temas
// Descrição: Funções para CRUD de Temas de Oficinas
// ========================================

export async function getAllTemas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(temas);
}

export async function getTemaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(temas).where(eq(temas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTema(data: { titulo: string; descricao?: string; cargaHoraria: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(temas).values(data);
  return result;
}

export async function updateTema(id: number, data: Partial<{ titulo: string; descricao?: string; cargaHoraria: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(temas).set(data).where(eq(temas.id, id));
}

export async function deleteTema(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(temas).where(eq(temas.id, id));
}

// ========================================
// DANIEL: Helpers de Query para Professores
// Descrição: Funções para CRUD de Professores
// ========================================

export async function getAllProfessores() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(professores);
}

export async function getProfessorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(professores).where(eq(professores.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createProfessor(data: { nome: string; cargo: string; telefone?: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(professores).values(data);
  return result;
}

export async function updateProfessor(id: number, data: Partial<{ nome: string; cargo: string; telefone?: string; email: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(professores).set(data).where(eq(professores.id, id));
}

export async function deleteProfessor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(professores).where(eq(professores.id, id));
}

// ========================================
// DANIEL: Helpers de Query para Tutores
// Descrição: Funções para CRUD de Tutores
// ========================================

export async function getAllTutores() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tutores);
}

export async function getTutorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(tutores).where(eq(tutores.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTutor(data: { nome: string; telefone?: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tutores).values(data);
  return result;
}

export async function updateTutor(id: number, data: Partial<{ nome: string; telefone?: string; email: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(tutores).set(data).where(eq(tutores.id, id));
}

export async function deleteTutor(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(tutores).where(eq(tutores.id, id));
}

// ========================================
// DANIEL: Helpers de Query para Alunos
// Descrição: Funções para CRUD de Alunos
// ========================================

export async function getAllAlunos() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(alunos);
}

export async function getAlunoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(alunos).where(eq(alunos.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createAluno(data: { nome: string; telefone?: string; email: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(alunos).values(data);
  return result;
}

export async function updateAluno(id: number, data: Partial<{ nome: string; telefone?: string; email: string }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(alunos).set(data).where(eq(alunos.id, id));
}

export async function deleteAluno(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(alunos).where(eq(alunos.id, id));
}

// ========================================
// DANIEL: Helpers de Query para Oficinas
// Descrição: Funções para CRUD de Oficinas
// ========================================

export async function getAllOficinas() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(oficinas);
}

export async function getOficinaById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(oficinas).where(eq(oficinas.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createOficina(data: { titulo: string; descricao?: string; temaId: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(oficinas).values(data);
  return result;
}

export async function updateOficina(id: number, data: Partial<{ titulo: string; descricao?: string; temaId: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(oficinas).set(data).where(eq(oficinas.id, id));
}

export async function deleteOficina(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(oficinas).where(eq(oficinas.id, id));
}

// ========================================
// DANIEL: Helpers de Query para Certificados
// Descrição: Funções para CRUD de Certificados
// ========================================

export async function getAllCertificados() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(certificados);
}

export async function getCertificadoById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(certificados).where(eq(certificados.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCertificado(data: { alunoId: number; oficinaId: number; descricao?: string; cargaHoraria: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(certificados).values(data);
  return result;
}

export async function updateCertificado(id: number, data: Partial<{ alunoId: number; oficinaId: number; descricao?: string; cargaHoraria: number }>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(certificados).set(data).where(eq(certificados.id, id));
}

export async function deleteCertificado(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(certificados).where(eq(certificados.id, id));
}
