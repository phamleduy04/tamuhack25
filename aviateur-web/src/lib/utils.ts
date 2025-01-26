import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAircraftImage(cookedSeed: number, input: string) {
  const images = [
    "/img/aircraft/Airbus-A319.png",
    "/img/aircraft/Airbus-A320.png",
    "/img/aircraft/Airbus-A321.png",
    "/img/aircraft/Boeing-737-800.png",
    "/img/aircraft/Boeing-777-200ER.png",
    "/img/aircraft/Boeing-777-300ER.png",
    "/img/aircraft/Boeing-787-8.png",
    "/img/aircraft/Boeing-787-9.png",
    "/img/aircraft/Bombardier-CRJ200.png",
    "/img/aircraft/Bombardier-CRJ700.png",
    "/img/aircraft/Bombardier-CRJ900.png",
    "/img/aircraft/Embraer-E145.png",
    "/img/aircraft/Embraer-E170.png",
    "/img/aircraft/Embraer-E175.png",
  ];

  const hash = crypto.createHash('sha256');
  hash.update(cookedSeed.toString()+input);
  const hashedValue = hash.digest('hex');
  const numericValue = parseInt(hashedValue.substring(0, 8), 16);
  const aircraft = images[numericValue % images.length]
  const acid = aircraft.split("/")[3].split(".")[0].split("-")
  acid.shift()

  return { aircraft: `${aircraft.split("/")[3].split(".")[0].split("-")[0]} ${acid.join("-")}`, image: aircraft };
}