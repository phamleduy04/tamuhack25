"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { createReport } from "@/actions/report";
import { useRouter } from "next/navigation";

interface ClientProps {
	id: string;
	files: {
		key: string;
		url: string;
	}[];
}

export default function Client({ id, files }: ClientProps) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [fileUrl, setFileUrl] = useState("");
	const router = useRouter();
	const { executeAsync } = useAction(createReport);

	async function handleCreateReport() {
		if (!title || title.length === 0) {
			alert("Please enter a title");
			return;
		}

		if (!description || description.length === 0) {
			alert("Please enter a description");
			return;
		}

		if (!fileUrl || fileUrl.length === 0) {
			alert("Please select a file");
			return;
		}

		const result = await executeAsync({
			aircraftId: id,
			title: title,
			description: description,
			fileUrl: fileUrl,
		});

		if (!result?.data) {
			alert("Failed to create report");
			return;
		}

		alert("Report created successfully!");
		router.push(`/reports/${result.data.reportId}`);
	}

	return (
		<div className="max-w-[700px] flex flex-col gap-y-2">
			<p>Report Title</p>
			<Input
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="text-black mb-5"
			/>
			<p>Report Description</p>
			<Textarea
				placeholder="Description"
				value={description}
				onChange={(e) => setDescription(e.target.value)}
				className="text-black mb-5"
			/>
			<p>Scan</p>
			<Select onValueChange={(value) => setFileUrl(value)}>
				<SelectTrigger className="w-[50%] text-black">
					<SelectValue placeholder="Scan File" />
				</SelectTrigger>
				<SelectContent>
					{files.map((file) => (
						<SelectItem key={file.url} value={file.url}>
							{file.key}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button onClick={handleCreateReport} className="dark w-min mt-14">
				Create Report
			</Button>
		</div>
	);
}
