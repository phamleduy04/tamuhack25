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

export default function Client({ id }: { id: string }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");

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
			<Select>
				<SelectTrigger className="w-[50%] text-black">
					<SelectValue placeholder="Scan File" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="light">Light</SelectItem>
					<SelectItem value="dark">Dark</SelectItem>
					<SelectItem value="system">System</SelectItem>
				</SelectContent>
			</Select>
			<Button className="dark w-min mt-14">Create Report</Button>
		</div>
	);
}
