import { useEffect, useState, useRef } from "react";
import { PageLayout } from "@/components/PageLayout";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Thread {
  other_id: string;
  other_name: string;
  last_content: string;
  last_at: string;
  unread: number;
}

export default function Messages() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;
    loadThreads();
    const ch = supabase
      .channel("msg-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, () => {
        loadThreads();
        if (active) loadMessages(active);
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, active]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const loadThreads = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    const map = new Map<string, Thread>();
    (data ?? []).forEach((m: any) => {
      const other = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      if (!map.has(other)) {
        map.set(other, {
          other_id: other,
          other_name: "User",
          last_content: m.content,
          last_at: m.created_at,
          unread: 0,
        });
      }
      const t = map.get(other)!;
      if (m.receiver_id === user.id && !m.is_read) t.unread++;
    });
    const list = Array.from(map.values());
    const ids = list.map((t) => t.other_id);
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, name, avatar_url").in("id", ids);
      const pm: Record<string, any> = {};
      (profs ?? []).forEach((p: any) => { pm[p.id] = p; });
      setProfiles(pm);
      list.forEach((t) => { t.other_name = pm[t.other_id]?.name ?? "User"; });
    }
    setThreads(list);
  };

  const loadMessages = async (otherId: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
    await supabase.from("messages").update({ is_read: true }).eq("receiver_id", user.id).eq("sender_id", otherId);
  };

  const openThread = (id: string) => { setActive(id); loadMessages(id); };

  const send = async () => {
    if (!text.trim() || !active || !user) return;
    await supabase.from("messages").insert({ sender_id: user.id, receiver_id: active, content: text.trim() });
    setText("");
    loadMessages(active);
  };

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="container py-8">
          <h1 className="font-display text-3xl font-bold mb-6">Messages</h1>
          <div className="grid md:grid-cols-[320px_1fr] gap-4 h-[70vh] border rounded-xl overflow-hidden">
            <aside className="border-r overflow-y-auto bg-muted/30">
              {threads.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2" />
                  No conversations yet
                </div>
              ) : threads.map((t) => (
                <button
                  key={t.other_id}
                  onClick={() => openThread(t.other_id)}
                  className={`w-full text-left p-4 border-b hover:bg-background transition ${active === t.other_id ? "bg-background" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.other_name}</span>
                    {t.unread > 0 && <span className="bg-primary text-primary-foreground text-xs px-2 rounded-full">{t.unread}</span>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{t.last_content}</p>
                  <p className="text-xs text-muted-foreground mt-1">{formatDistanceToNow(new Date(t.last_at), { addSuffix: true })}</p>
                </button>
              ))}
            </aside>
            <section className="flex flex-col">
              {!active ? (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">Select a conversation</div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[70%] px-4 py-2 rounded-2xl ${m.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                          <p className="text-sm">{m.content}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={endRef} />
                  </div>
                  <div className="border-t p-3 flex gap-2">
                    <Input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Type a message…" />
                    <Button onClick={send}><Send className="h-4 w-4" /></Button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}
