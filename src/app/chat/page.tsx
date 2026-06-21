import { NewChat } from "@/components/new-chat";
import { createProvider } from "@/lib/ai-provider.mjs";

export default function ChatPage() {
  const provider = createProvider(process.env);
  return <NewChat providerLabel={provider.label} />;
}
