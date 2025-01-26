import Image from "next/image";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Nav() {
	return (
		<div className="absolute top-0 left-0 w-full">
			<div className="max-w-7xl h-20 mx-auto px-10 grid grid-cols-2">
				<div className="flex gap-x-2 items-center">
					<Link href="/">
						<div className="flex items-center gap-x-2">
							<Image
								src="/img/aalogo-mono.svg"
								height={35}
								width={35}
								alt="American Airlines Logo"
								className="invert"
							/>
							<h1 className="font-bold text-2xl">Aviateur</h1>
						</div>
					</Link>
				</div>
				<div className="flex justify-end items-center">
					<div className="scale-125">
						<UserButton />
					</div>
				</div>
			</div>
		</div>
	);
}
