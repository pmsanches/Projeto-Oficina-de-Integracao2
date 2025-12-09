/**
 * Configuração da conexão com o banco de dados PostgreSQL
 * Utiliza a biblioteca postgres.js
 */
import postgres from "postgres"

// Configuração da conexão com o PostgreSQL via postgres.js
// Usa variáveis de ambiente ou valores padrão para desenvolvimento local
const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: Number.parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "ellp_db",
  username: process.env.DB_USER || "ellp_user",
  password: process.env.DB_PASSWORD || "ellp_senha123",
})

// Função auxiliar para executar queries no banco
// Mantém compatibilidade com o código existente
// Recebe o texto da query e os parâmetros opcionais
export async function query(text: string, params?: unknown[]) {
  // Se não houver parâmetros, executa query simples
  if (!params || params.length === 0) {
    const result = await sql.unsafe(text)
    return { rows: result }
  }
  // Se houver parâmetros, executa query parametrizada
  const result = await sql.unsafe(text, params)
  return { rows: result }
}

export default sql
