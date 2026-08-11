"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  MessageSquare,
  Send,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatDateTime, truncate } from "@/lib/utils";

type Thread = {
  id: string;
  updatedAt: string;
  booking: {
    id: string;
    bookingRef: string;
    vehicle: { make: string; model: string; year: number };
  } | null;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    sender: { id: string; name: string; firstName: string };
  }[];
  otherPartyName?: string;
  otherPartyId?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
};

type Message = {
  id: string;
  content: string;
  createdAt: string;
  threadId: string;
  senderId: string;
  receiverId: string;
  sender: {
    id: string;
    name: string;
    firstName: string;
    avatarUrl: string | null;
  };
};

function ThreadListSkeleton() {
  return (
    <div className="space-y-1 p-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg p-3">
          <Skeleton className="h-10 w-10 flex-shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-3 w-12" />
        </div>
      ))}
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-start">
        <Skeleton className="h-16 w-48 rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-36 rounded-2xl" />
      </div>
      <div className="flex justify-start">
        <Skeleton className="h-20 w-56 rounded-2xl" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-12 w-44 rounded-2xl" />
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const currentUserId = (session?.user as { id?: string })?.id;
  const [threads, setThreads] = useState<Thread[]>([]);
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [mobileShowMessages, setMobileShowMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await fetch("/api/messages");
        if (res.ok) {
          const data = await res.json();
          const threadList: Thread[] = (data.data || data || []).map(
            (t: Thread) => {
              const lastMsg = t.messages?.[0];
              const otherSender =
                lastMsg && currentUserId && lastMsg.sender.id !== currentUserId
                  ? lastMsg.sender
                  : null;
              return {
                ...t,
                otherPartyName: otherSender?.name || lastMsg?.sender?.name || "Unknown",
                lastMessage: lastMsg?.content || "",
                lastMessageTime: lastMsg?.createdAt || t.updatedAt,
              };
            }
          );
          setThreads(threadList);
        }
      } catch {
      } finally {
        setLoadingThreads(false);
      }
    }
    fetchThreads();
  }, [currentUserId]);

  const fetchMessages = useCallback(async (threadId: string) => {
    setLoadingMessages(true);
    try {
      const res = await fetch(`/api/messages?threadId=${threadId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.data || data || []);
      }
    } catch {
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectThread = (thread: Thread) => {
    setSelectedThread(thread);
    setMobileShowMessages(true);
    fetchMessages(thread.id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedThread || sending) return;

    setSending(true);
    try {
      const lastMsg = messages[messages.length - 1];
      const receiverId =
        lastMsg && currentUserId
          ? lastMsg.senderId === currentUserId
            ? lastMsg.receiverId
            : lastMsg.senderId
          : undefined;

      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          threadId: selectedThread.id,
          content: newMessage.trim(),
          receiverId,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const msg = data.data || data;
        setMessages((prev) => [...prev, msg]);
        setNewMessage("");
      }
    } catch {
    } finally {
      setSending(false);
    }
  };

  const handleBackToThreads = () => {
    setMobileShowMessages(false);
    setSelectedThread(null);
  };

  const formatMessageTime = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < 24) {
      return d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      });
    }
    if (diffHours < 168) {
      return d.toLocaleDateString("en-US", { weekday: "short" });
    }
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col p-4 sm:p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="mt-1 text-sm text-gray-500">
          Communicate with hosts and renters.
        </p>
      </div>

      <Card className="flex min-h-0 flex-1 overflow-hidden">
        <div
          className={cn(
            "w-full flex-shrink-0 border-r border-gray-200 md:w-80 lg:w-96",
            mobileShowMessages ? "hidden md:flex md:flex-col" : "flex flex-col"
          )}
        >
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-700">
              Conversations
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingThreads ? (
              <ThreadListSkeleton />
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <MessageSquare className="mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No messages yet</p>
                <p className="mt-1 text-xs text-gray-400">
                  Start a conversation from a booking
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => handleSelectThread(thread)}
                    className={cn(
                      "flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-gray-50",
                      selectedThread?.id === thread.id && "bg-neutral-50"
                    )}
                  >
                    <Avatar
                      name={thread.otherPartyName}
                      size="sm"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {thread.otherPartyName}
                        </p>
                        <span className="flex-shrink-0 text-xs text-gray-400">
                          {thread.lastMessageTime &&
                            formatMessageTime(thread.lastMessageTime)}
                        </span>
                      </div>
                      {thread.booking && (
                        <p className="truncate text-xs text-neutral-800">
                          {thread.booking.vehicle.year}{" "}
                          {thread.booking.vehicle.make}{" "}
                          {thread.booking.vehicle.model}
                        </p>
                      )}
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {thread.lastMessage
                          ? truncate(thread.lastMessage, 50)
                          : "No messages"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            !mobileShowMessages && "hidden md:flex"
          )}
        >
          {selectedThread ? (
            <>
              <div className="flex items-center gap-3 border-b border-gray-200 p-4">
                <button
                  onClick={handleBackToThreads}
                  className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 md:hidden"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar
                  name={selectedThread.otherPartyName}
                  size="sm"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {selectedThread.otherPartyName}
                  </p>
                  {selectedThread.booking && (
                    <p className="truncate text-xs text-gray-500">
                      Re: {selectedThread.booking.vehicle.year}{" "}
                      {selectedThread.booking.vehicle.make}{" "}
                      {selectedThread.booking.vehicle.model} (
                      {selectedThread.booking.bookingRef})
                    </p>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {loadingMessages ? (
                  <MessagesSkeleton />
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-gray-400">
                      No messages in this conversation yet
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => {
                      const isOwn = msg.sender.id === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={cn(
                            "flex",
                            isOwn ? "justify-end" : "justify-start"
                          )}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2.5",
                              isOwn
                                ? "rounded-br-md bg-neutral-800 text-white"
                                : "rounded-bl-md bg-gray-100 text-gray-900"
                            )}
                          >
                            <p className="text-sm whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            <p
                              className={cn(
                                "mt-1 text-[10px]",
                                isOwn ? "text-neutral-200" : "text-gray-400"
                              )}
                            >
                              {formatMessageTime(msg.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 border-t border-gray-200 p-4"
              >
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm placeholder:text-gray-400 focus:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-800/20"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!newMessage.trim() || sending}
                  className="h-10 w-10 rounded-full"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-center">
              <MessageSquare className="mb-3 h-12 w-12 text-gray-300" />
              <p className="text-sm font-medium text-gray-900">
                Select a conversation
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Choose a thread from the left to view messages
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
