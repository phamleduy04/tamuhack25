import { db } from "@/db";
import { messages } from "@/db/schema";
import { eq } from "drizzle-orm";
import Chat from "./chat";

export default async function Messages({ reportId }: { reportId: string }) {
	const initialMessages = await db.query.messages.findMany({
		where: eq(messages.reportId, reportId),
		orderBy: (messages, { asc }) => [asc(messages.createdAt)],
	});

	return (
		<div className="h-full">
			<Chat reportId={reportId} initialMessages={initialMessages} />
		</div>
	);
}
