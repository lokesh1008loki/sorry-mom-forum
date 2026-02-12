import { LiveChat } from "@/components/live-chat"
import { getSession } from "@/lib/auth"

export default async function LiveChatPage() {
  const session = await getSession()

  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Live Chat</h1>
      <div className="max-w-4xl mx-auto">
        <LiveChat fullPage={true} user={session} />
      </div>
    </div>
  )
}
