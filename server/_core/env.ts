// ========================================
// Configurações de Ambiente
// Descrição: Centraliza todas as variáveis de ambiente da aplicação
// ========================================

export const ENV = {
  // ID da aplicação
  appId: process.env.VITE_APP_ID ?? "ellp-oficinas",
  
  // Chave secreta para JWT
  cookieSecret: process.env.JWT_SECRET ?? "default-secret-change-in-production",
  
  // URL do banco de dados
  databaseUrl: process.env.DATABASE_URL ?? "",
  
  // URL do servidor OAuth
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "http://localhost:5000/api/auth",
  
  // ID do usuário administrador
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "admin",
  
  // Ambiente de produção
  isProduction: process.env.NODE_ENV === "production",
  
  // URL da API Forge
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  
  // Chave da API Forge
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};
