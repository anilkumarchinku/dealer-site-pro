import { Plus_Jakarta_Sans } from "next/font/google";
import { getLatestCars } from "@/lib/services/car-service";
import WelcomeClient from "./welcome-client-v2";
import type { Car } from "@/lib/types/car";

// Marketing landing font — modern geometric sans, self-hosted (no layout shift).
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

export default async function WelcomePage() {
    // Fetch data on the server — gracefully fallback to empty array on error
    let latestCars: Car[];
    try {
        latestCars = await getLatestCars(9);
    } catch {
        latestCars = [];
    }

    return (
        <div className={jakarta.className}>
            <WelcomeClient
                cars={latestCars}
            />
        </div>
    );
}
