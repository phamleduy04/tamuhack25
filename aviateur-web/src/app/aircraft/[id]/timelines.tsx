import { getAirportsData } from "@/lib/api";

interface TimeLineItem {
	fromName: string | null;
	fromCode: string | null;
	fromLocation: string | null;
	toName: string | null;
	toCode: string | null;
	toLocation: string | null;
	isCurrent: boolean;
	isStart: boolean;
	isEnd: boolean;
	estimated_out: string;
	estimated_in: string;
}

function TimeLineItem({
	fromName,
	fromLocation,
	fromCode,
	toName,
	toCode,
	toLocation,
	isCurrent,
	isStart,
	isEnd,
	estimated_out,
	estimated_in,
}: TimeLineItem) {
	// console.log(estimated_out, estimated_in)
	// console.log(new Date(estimated_in).getTime() - new Date(estimated_out).getTime())
	return (
		<>
			<div className="flex flex-col justify-end">
				<div className="flex flex-col gap-y-1 pb-1">
					<div className="flex gap-x-2 items-center justify-start">
						<div className="w-1 h-1 bg-black rounded-full"></div>
						<p className="text-xs text-zinc-400">{toCode ? toCode : ""}</p>
					</div>
					<div className="flex items-center justify-stretch">
						<div className="bg-black w-1 h-8 rounded-full"></div>
						<div className="pl-2">
							<p className="text-xs font-semibold">
								{fromLocation ? fromLocation : "TBA"} to{" "}
								{toLocation ? toLocation : "TBA"}
							</p>
							{/* <p className="text-[0.7rem] font-medium">
								{`Arrived ${new Date(estimated_in).getTime() - new Date(estimated_out).getTime()}`}
							</p> */}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default function Timeline({ items }: { items: TimeLineItem[] }) {
	return (
		<div className="flex flex-col mt-auto justify-self-center origin-bottom-left">
			{items.map((item, index) => {
				return <TimeLineItem key={index} {...item} />;
			})}
		</div>
	);
}
