import { db } from "@/db";
import { reports } from "@/db/schema";
import { getSpecificAircraftData } from "@/lib/api";
import { eq } from "drizzle-orm";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Messages from "./messages";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function Page({ params }: PageProps) {
	const { id } = await params;

	const report = await db.query.reports.findFirst({
		where: eq(reports.id, id),
	});

	if (!report) {
		return <div>Report not found</div>;
	}

	const aircraft = await getSpecificAircraftData(report.icao24);

	if (!aircraft) {
		return <div>Aircraft not found for report</div>;
	}

	return (
		<div className="w-full max-w-7xl px-10 mx-auto pt-[10vh] font-arimo">
			<div className="bg-white rounded-lg p-5 h-80 grid grid-cols-2 auto-rows-[100%] text-black">
				<div className="flex flex-col items-start justify-center gap-y-2">
					<h1 className="text-5xl font-bold">{report.title}</h1>
					<p className="font-bold font-mono text-lg pl-1">
						{aircraft.tail_number} • {aircraft.callsign} •{" "}
						{aircraft.icao24.toUpperCase()}
					</p>
					<div className="pt-3 flex items-center gap-x-3">
						<Link href={`/aircraft/${aircraft.icao24}`}>
							<Button>View Aircraft</Button>
						</Link>
						<Link
							href={`https://viewer.aviateur.tech/?url=${encodeURIComponent(
								report.attachedScan || "unknown"
							)}`}
							target="_blank"
						>
							<Button>View Scan</Button>
						</Link>
					</div>
				</div>
				<div className="flex items-center justify-center overflow-hidden">
					<Image
						src={`/img/aircraft/a321.png`}
						alt={"Plane Image"}
						width={500}
						height={500}
						className="object-cover -translate-y-5 rotate-3 drop-shadow-2xl"
					/>
				</div>
			</div>
			<div className="bg-white rounded-lg p-5 h-80 grid grid-cols-1 auto-rows-[100%] text-black mt-3">
				<div className="flex flex-col items-start justify-start gap-y-2">
					<h1 className="text-3xl font-bold">Description</h1>
					<p className="text-lg text-balance pt-3">{report.description}</p>
				</div>
			</div>
			<div className="bg-white rounded-lg p-5 min-h-72 w-full mt-3">
				<div className="flex flex-col items-start justify-start gap-y-2 text-black">
					<h1 className="text-3xl font-bold">Discussion</h1>
					<div className="w-full h-72 mt-3">
						<Messages reportId={id} />
					</div>
				</div>
			</div>
		</div>
	);
}
