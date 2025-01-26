"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group } from "three";
import { USDZLoader } from "three-usdz-loader";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			group: any;
			primitive: any;
			ambientLight: any;
			directionalLight: any;
		}
	}
}

function Model({ url }: { url: string }) {
	const groupRef = useRef<Group>(null);
	const [model, setModel] = useState<any>(null);

	useEffect(() => {
		const loader = new USDZLoader();

		fetch(url)
			.then((res) => res.blob())
			.then((blob) => {
				const file = new File([blob], "model.usdz");
				if (groupRef.current) {
					loader.loadFile(file, groupRef.current).then((loadedModel) => {
						setModel(loadedModel);
					});
				}
			});

		return () => {
			if (model) {
				model.clean();
			}
		};
	}, [url]);

	return <primitive object={groupRef.current || new Group()} />;
}

export default function Viewer({ modelUrl = "https://cdn.aviateur.tech/1737906845331-model-mobile.usdz" }) {
	return (
		<div style={{ width: "100%", height: "100vh" }}>
			<Canvas camera={{ position: [0, 0, 5] }}>
				<Suspense fallback={null}>
					<Model url={modelUrl} />
					<OrbitControls />
				</Suspense>
				<ambientLight intensity={0.5} />
				<directionalLight position={[10, 10, 5]} intensity={1} />
			</Canvas>
		</div>
	);
}
