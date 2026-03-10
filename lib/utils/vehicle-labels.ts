/**
 * Returns vehicle-type-aware labels for use in templates and UI.
 * Pass '2w' for bikes/scooters, '3w' for autos/cargo, '4w' (default) for cars.
 */
export function getVehicleLabels(type?: '2w' | '3w' | '4w') {
    switch (type) {
        case '2w':
            return {
                newVehicle: 'New Bikes',
                usedVehicle: 'Used Bikes',
                testDrive: 'Test Ride',
                exchange: 'Bike Exchange',
                browseCTA: 'Browse Bikes',
                testDriveVerb: 'Test Ride',
                whichVehicle: 'Which bike/scooter?',
                testDrivePlaceholder: 'Tell us which bike you want to test ride',
                testDriveBook: 'BOOK TEST RIDE',
                perfectVehicle: 'Perfect Bike',
                familyVehicle: 'bike',
                exchangeDesc: 'Trade in your old bike easily',
                newVehicleDesc: 'Brand new bikes and scooters direct from manufacturer',
                testDriveDesc: 'Take your dream bike for a spin',
                vehicleSingular: 'bike',
            }
        case '3w':
            return {
                newVehicle: 'New Autos',
                usedVehicle: 'Used Autos',
                testDrive: 'Test Drive',
                exchange: 'Auto Exchange',
                browseCTA: 'Browse Autos',
                testDriveVerb: 'Test Drive',
                whichVehicle: 'Which auto/vehicle?',
                testDrivePlaceholder: 'Tell us which vehicle you want to test drive',
                testDriveBook: 'BOOK TEST DRIVE',
                perfectVehicle: 'Perfect Auto',
                familyVehicle: 'auto',
                exchangeDesc: 'Trade in your old auto easily',
                newVehicleDesc: 'Brand new autos and cargo vehicles',
                testDriveDesc: 'Take your chosen auto for a test drive',
                vehicleSingular: 'auto',
            }
        default: // '4w' or undefined
            return {
                newVehicle: 'New Cars',
                usedVehicle: 'Used Cars',
                testDrive: 'Test Drive',
                exchange: 'Car Exchange',
                browseCTA: 'Browse Cars',
                testDriveVerb: 'Test Drive',
                whichVehicle: 'Which car? / Message',
                testDrivePlaceholder: 'Tell us which vehicle you want to test drive',
                testDriveBook: 'BOOK TEST DRIVE',
                perfectVehicle: 'Perfect Car',
                familyVehicle: 'car',
                exchangeDesc: 'Trade in your old car easily',
                newVehicleDesc: 'Brand new vehicles direct from manufacturer',
                testDriveDesc: 'Take your dream car for a spin',
                vehicleSingular: 'car',
            }
    }
}
