import { ChatProvider } from '@/contexts/chat-context'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <SidebarProvider>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </ChatProvider>
  )
}
