import { LiveChat } from "@/components/live-chat"

export default function LiveChatPage() {
  return (
    <div className="container py-6">
      <h1 className="text-3xl font-bold mb-6">Live Chat</h1>
      <div className="max-w-4xl mx-auto">
        <LiveChat fullPage={true} />
      </div>
    </div>
  )
}
