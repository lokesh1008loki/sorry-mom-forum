import { prisma } from "@/lib/prisma"

export type CreateTelegramChannelInput = {
  name: string
  url: string
  description?: string
  priority?: number
  iconUrl?: string
  isActive?: boolean
  createdBy?: string
}

export type UpdateTelegramChannelInput = Partial<CreateTelegramChannelInput> & {
  id: string
}

export async function getTelegramChannels(activeOnly = true) {
  return await prisma.telegramChannel.findMany({
    where: activeOnly ? { isActive: true } : {},
    orderBy: { priority: 'desc' }
  })
}

export async function createTelegramChannel(data: CreateTelegramChannelInput) {
  return await prisma.telegramChannel.create({
    data: {
      ...data,
      priority: data.priority ?? 0,
      isActive: data.isActive ?? true
    }
  })
}

export async function updateTelegramChannel({ id, ...data }: UpdateTelegramChannelInput) {
  return await prisma.telegramChannel.update({
    where: { id },
    data
  })
}

export async function deleteTelegramChannel(id: string) {
  return await prisma.telegramChannel.delete({
    where: { id }
  })
}

export async function getTelegramChannelById(id: string) {
  return await prisma.telegramChannel.findUnique({
    where: { id }
  })
}
