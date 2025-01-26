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
}: TimeLineItem) {
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default function Timeline({ items }: { items: TimeLineItem[] }) {
	return (
		<div className="flex flex-col mt-auto justify-self-center scale-125 origin-bottom-left">
			{items.map((item) => {
				return <TimeLineItem key={item.fromCode} {...item} />;
			})}
		</div>
	);
}
