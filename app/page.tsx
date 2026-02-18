import { getLatestCars } from "@/lib/services/car-service";
import WelcomeClient from "./welcome-client";

export default async function WelcomePage() {
    // Fetch data on the server
    const latestCars = await getLatestCars(8);

    return (
        <WelcomeClient
            cars={latestCars}
        />
    );
}
