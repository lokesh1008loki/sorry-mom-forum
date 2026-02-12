declare module 'fastify' {
  import { Server as HttpServer } from 'http'
  import { Server as SocketServer } from 'socket.io'

  interface FastifyInstance {
    server: HttpServer
    listen(options: { port: number, host: string }): Promise<void>
  }

  const fastify: () => FastifyInstance
  export default fastify
}

declare module 'socket.io' {
  import { Server as HttpServer } from 'http'

  export class Server {
    constructor(server: HttpServer, options?: any)
    use(fn: (socket: any, next: (err?: Error) => void) => void): this
    on(event: string, listener: (...args: any[]) => void): this
    emit(event: string, ...args: any[]): this
    to(room: string): {
      emit(event: string, ...args: any[]): void
    }
  }

  export interface Socket {
    data: any
    handshake: {
      auth: {
        token: string
      }
    }
    join(room: string): void
    on(event: string, listener: (...args: any[]) => void): this
    emit(event: string, ...args: any[]): this
  }
}

declare module '@prisma/client' {
  export interface ChatMessage {
    id: string
    content: string
    type: string
    fileUrl?: string
    fileSize?: number
    userId: string
    username: string
    createdAt: Date
  }

  export class PrismaClient {
    chatMessage: {
      create: (args: { data: any }) => Promise<ChatMessage>
      findMany: (args: any) => Promise<ChatMessage[]>
    }
  }
}

declare module 'dotenv' {
  export function config(): void
}

declare module 'firebase-admin/app' {
  export function initializeApp(options: any): any
  export function cert(credential: any): any
}

declare module 'firebase-admin/storage' {
  export function getStorage(): {
    bucket(): {
      file(name: string): {
        save(data: Buffer, options: any): Promise<void>
        makePublic(): Promise<void>
      }
    }
  }
} 