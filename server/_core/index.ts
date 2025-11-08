import "dotenv/config"
import express from "express"
import { createServer } from "http"
import net from "net"
import { createExpressMiddleware } from "@trpc/server/adapters/express"
import { registerOAuthRoutes } from "./oauth"
import { appRouter } from "../routers"
import { createContext } from "./context"
import { serveStatic, setupVite } from "./vite"

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.listen(port, () => {
      server.close(() => resolve(true))
    })
    server.on("error", () => resolve(false))
  })
}

async function findAvailablePort(startPort = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port
    }
  }
  throw new Error(`No available port found starting from ${startPort}`)
}

async function startServer() {
  const app = express()
  const server = createServer(app)
  // Configura o body parser com limite maior para upload de arquivos
  app.use(express.json({ limit: "50mb" }))
  app.use(express.urlencoded({ limit: "50mb", extended: true }))
  // Callback OAuth em /api/oauth/callback
  registerOAuthRoutes(app)
  // API tRPC
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  )
  // modo de desenvolvimento usa Vite, modo de produção usa arquivos estáticos
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server)
  } else {
    serveStatic(app)
  }

  const preferredPort = Number.parseInt(process.env.PORT || "3000")
  const port = await findAvailablePort(preferredPort)

  if (port !== preferredPort) {
    console.log(`Porta ${preferredPort} está ocupada, usando porta ${port}`)
  }

  server.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`)
  })
}

startServer().catch(console.error)
