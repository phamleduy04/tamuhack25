"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { sendMessage } from "@/actions/report";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Message {
	id: string;
	message: string;
	createdAt: Date | null;
	reportId: string | null;
	authorId: string | null;
	authorImage: string | null;
	authorName: string | null;
}

interface ChatProps {
	reportId: string;
	initialMessages: Message[];
}

export default function Chat({ reportId, initialMessages }: ChatProps) {
	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>(initialMessages);
	const { executeAsync } = useAction(sendMessage);
	const router = useRouter();

	async function handleSendMessage() {
		if (!message || message.length === 0) return;

		const result = await executeAsync({
			reportId,
			message,
		});

		if (!result?.data) {
			alert("Failed to send message");
			return;
		}

		setMessage("");
		router.refresh();
	}

	return (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-y-auto space-y-4 p-4">
				{messages.map((msg) => (
					<div
						key={msg.id}
						className="bg-white rounded-lg p-3 text-black border"
					>
						<div className="flex items-center gap-2 mb-2">
							{msg.authorImage && (
								<Image
									src={msg.authorImage}
									alt={msg.authorName || "User"}
									width={24}
									height={24}
									className="rounded-full"
								/>
							)}
							<span className="font-semibold text-sm">
								{msg.authorName || "Unknown User"}
							</span>
							<span className="text-xs text-zinc-500">
								{msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ""}
							</span>
						</div>
						<p className="text-sm">{msg.message}</p>
					</div>
				))}
			</div>
			<div className="p-4 border-t bg-white">
				<div className="flex gap-2">
					<Input
						placeholder="Type a message..."
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSendMessage();
							}
						}}
						className="flex-1"
					/>
					<Button onClick={handleSendMessage}>Send</Button>
				</div>
			</div>
		</div>
	);
}
