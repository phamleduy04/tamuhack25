import Client from "./client";
import { $fetch } from "@/lib/api";

export default async function Page({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const id = (await searchParams).id as string;
	const { data: files, error } = await $fetch("/files");

	if (error) {
		return <div>Error fetching files</div>;
	}

	if (!id) {
		return <div>No ID provided</div>;
	}

	return (
		<div className="min-h-screen px-10 font-arimo">
			<div className="max-w-7xl px-10 mx-auto pt-[20vh]">
				<h1 className="text-8xl font-bold">New Report</h1>
				<p className="text-2xl pt-3 pb-10">
					Create a new report for aircraft {id}
				</p>
				<Client
					id={id}
					files={files.map((file) => ({ key: file.key, url: file.url }))}
				/>
			</div>
		</div>
	);
}
