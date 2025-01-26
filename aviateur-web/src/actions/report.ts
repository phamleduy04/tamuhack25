"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { reports, messages } from "@/db/schema";
import { nanoid } from "nanoid";
import { revalidatePath } from "next/cache";

export const createReport = actionClient
	.schema(
		z.object({
			aircraftId: z.string(),
			title: z.string(),
			description: z.string(),
			fileUrl: z.string(),
		})
	)
	.action(async ({ parsedInput, ctx }) => {
		const user = await currentUser();

		if (!user) {
			throw new Error("User not found");
		}

		const reportID = nanoid();

		const report = await db.insert(reports).values({
			id: reportID,
			icao24: parsedInput.aircraftId,
			title: parsedInput.title,
			description: parsedInput.description,
			authorId: user.id,
			authorImage: user.imageUrl,
			authorName: user.fullName || "Aviateur User",
			attachedScan: parsedInput.fileUrl,
		});

		return {
			success: true,
			reportId: reportID,
		};
	});

export const sendMessage = actionClient
	.schema(
		z.object({
			reportId: z.string(),
			message: z.string(),
		})
	)
	.action(async ({ parsedInput, ctx }) => {
		const user = await currentUser();

		if (!user) {
			throw new Error("User not found");
		}

		const messageId = nanoid();

		await db.insert(messages).values({
			id: messageId,
			reportId: parsedInput.reportId,
			message: parsedInput.message,
			authorId: user.id,
			authorImage: user.imageUrl,
			authorName: user.fullName || "Aviateur User",
		});

		revalidatePath(`/reports/${parsedInput.reportId}`);

		return {
			success: true,
			messageId: messageId,
		};
	});
