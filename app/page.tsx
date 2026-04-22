import { getLatestCars } from "@/lib/services/car-service";
import WelcomeClient from "./welcome-client";
import type { Car } from "@/lib/types/car";

export default async function WelcomePage() {
    // Fetch data on the server — gracefully fallback to empty array on error
    let latestCars: Car[];
    try {
        latestCars = await getLatestCars(9);
    } catch {
        latestCars = [];
    }

    return (
        <WelcomeClient
            cars={latestCars}
        />
    );
}
