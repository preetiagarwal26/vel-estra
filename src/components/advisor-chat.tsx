"use client";

import { useState } from "react";
import { askAdvisorAction } from "@/app/actions/advisor";
import { Button, Card, Input, Label, Select } from "@/components/ui";

type Message = { role: "user" | "assistant"; content: string };

export function AdvisorChat({
  deals,
  initialDealId,
  initialMessages,
}: {
  deals: Array<{ id: string; address_line: string }>;
  initialDealId?: string;
  initialMessages: Message[];
}) {
  const [dealId, setDealId] = useState(initialDealId ?? deals[0]?.id ?? "");
  const [question, setQuestion] = useState("What if I offer $400,000?");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function ask() {
    setBusy(true);
    setError("");
    try {
      const answer = await askAdvisorAction(dealId, question);
      setMessages((prev) => [
        ...prev,
        { role: "user", content: question },
        { role: "assistant", content: answer },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Advisor failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-4">
      <Card>
        <Label>Deal</Label>
        <Select value={dealId} onChange={(e) => setDealId(e.target.value)}>
          {deals.map((deal) => (
            <option key={deal.id} value={deal.id}>
              {deal.address_line}
            </option>
          ))}
        </Select>
        <div className="mt-4">
          <Label>Question</Label>
          <Input value={question} onChange={(e) => setQuestion(e.target.value)} />
        </div>
        {error ? <p className="mt-2 text-sm text-[#a33b32]">{error}</p> : null}
        <Button className="mt-4" disabled={!dealId || busy} onClick={ask}>
          {busy ? "Thinking…" : "Ask"}
        </Button>
      </Card>
      {messages.map((message, index) => (
        <Card key={`${message.role}-${index}`}>
          <p className="text-xs uppercase tracking-wide text-[#5d6b75]">{message.role}</p>
          <p className="mt-2">{message.content}</p>
        </Card>
      ))}
    </div>
  );
}
