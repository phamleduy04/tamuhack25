"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/db";
import { reports } from "@/db/schema";
import { nanoid } from "nanoid";

export const createReport = actionClient
	.schema(
		z.object({
			aircraftId: z.string(),
			title: z.string(),
			description: z.string(),
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
		});

		return {
			success: true,
			reportId: reportID,
		};
	});
