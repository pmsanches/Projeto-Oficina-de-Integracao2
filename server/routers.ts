import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getAllTemas, getTemaById, createTema, updateTema, deleteTema,
  getAllProfessores, getProfessorById, createProfessor, updateProfessor, deleteProfessor,
  getAllTutores, getTutorById, createTutor, updateTutor, deleteTutor,
  getAllAlunos, getAlunoById, createAluno, updateAluno, deleteAluno,
  getAllOficinas, getOficinaById, createOficina, updateOficina, deleteOficina,
  getAllCertificados, getCertificadoById, createCertificado, updateCertificado, deleteCertificado,
} from "./db";

// ========================================
// PAOLLA: Schemas de Validação
// Descrição: Define os schemas Zod para validação de dados de entrada
// ========================================

const temaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  cargaHoraria: z.number().min(1, "Carga horária deve ser maior que 0"),
});

const professorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cargo: z.string().min(1, "Cargo é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido"),
});

const tutorSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido"),
});

const alunoSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  telefone: z.string().optional(),
  email: z.string().email("Email inválido"),
});

const oficinaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  descricao: z.string().optional(),
  temaId: z.number().min(1, "Tema é obrigatório"),
});

const certificadoSchema = z.object({
  alunoId: z.number().min(1, "Aluno é obrigatório"),
  oficinaId: z.number().min(1, "Oficina é obrigatória"),
  descricao: z.string().optional(),
  cargaHoraria: z.number().min(1, "Carga horária deve ser maior que 0"),
});

// ========================================
// PAOLLA: Router de Temas
// Descrição: Procedimentos tRPC para CRUD de Temas
// ========================================

const temasRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllTemas();
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getTemaById(input.id);
  }),

  create: protectedProcedure.input(temaSchema).mutation(async ({ input }) => {
    return await createTema(input);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: temaSchema.partial() }))
    .mutation(async ({ input }) => {
      return await updateTema(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await deleteTema(input.id);
  }),
});

// ========================================
// PAOLLA: Router de Professores
// Descrição: Procedimentos tRPC para CRUD de Professores
// ========================================

const professoresRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllProfessores();
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getProfessorById(input.id);
  }),

  create: protectedProcedure.input(professorSchema).mutation(async ({ input }) => {
    return await createProfessor(input);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: professorSchema.partial() }))
    .mutation(async ({ input }) => {
      return await updateProfessor(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await deleteProfessor(input.id);
  }),
});

// ========================================
// PAOLLA: Router de Tutores
// Descrição: Procedimentos tRPC para CRUD de Tutores
// ========================================

const tutoresRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllTutores();
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getTutorById(input.id);
  }),

  create: protectedProcedure.input(tutorSchema).mutation(async ({ input }) => {
    return await createTutor(input);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: tutorSchema.partial() }))
    .mutation(async ({ input }) => {
      return await updateTutor(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await deleteTutor(input.id);
  }),
});

// ========================================
// PAOLLA: Router de Alunos
// Descrição: Procedimentos tRPC para CRUD de Alunos
// ========================================

const alunosRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllAlunos();
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getAlunoById(input.id);
  }),

  create: protectedProcedure.input(alunoSchema).mutation(async ({ input }) => {
    return await createAluno(input);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: alunoSchema.partial() }))
    .mutation(async ({ input }) => {
      return await updateAluno(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await deleteAluno(input.id);
  }),
});

// ========================================
// PAOLLA: Router de Oficinas
// Descrição: Procedimentos tRPC para CRUD de Oficinas
// ========================================

const oficinasRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllOficinas();
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getOficinaById(input.id);
  }),

  create: protectedProcedure.input(oficinaSchema).mutation(async ({ input }) => {
    return await createOficina(input);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: oficinaSchema.partial() }))
    .mutation(async ({ input }) => {
      return await updateOficina(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await deleteOficina(input.id);
  }),
});

// ========================================
// PAOLLA: Router de Certificados
// Descrição: Procedimentos tRPC para CRUD de Certificados
// ========================================

const certificadosRouter = router({
  list: protectedProcedure.query(async () => {
    return await getAllCertificados();
  }),

  getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    return await getCertificadoById(input.id);
  }),

  create: protectedProcedure.input(certificadoSchema).mutation(async ({ input }) => {
    return await createCertificado(input);
  }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), data: certificadoSchema.partial() }))
    .mutation(async ({ input }) => {
      return await updateCertificado(input.id, input.data);
    }),

  delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
    return await deleteCertificado(input.id);
  }),
});

// ========================================
// PAOLLA: Router Principal da Aplicação
// Descrição: Agrupa todos os routers e procedimentos de autenticação
// ========================================

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Routers de funcionalidades
  temas: temasRouter,
  professores: professoresRouter,
  tutores: tutoresRouter,
  alunos: alunosRouter,
  oficinas: oficinasRouter,
  certificados: certificadosRouter,
});

export type AppRouter = typeof appRouter;
