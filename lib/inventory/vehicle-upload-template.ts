export const VEHICLE_UPLOAD_CSV_HEADERS = [
    "make",
    "model",
    "variant",
    "year",
    "price_inr",
    "on_road_price_inr",
    "km_driven",
    "fuel",
    "transmission",
    "color",
    "body_type",
    "seating_capacity",
    "engine_cc",
    "registration_number",
    "vin",
    "condition",
    "status",
    "is_featured",
    "image_url",
    "image_urls",
    "features",
    "description",
    "insurance_status",
    "insurance_provider",
    "insurance_valid_until",
    "meta_title",
    "meta_description",
] as const;

export const VEHICLE_UPLOAD_EXAMPLE_ROWS: (string | number)[][] = [
    [
        "Maruti Suzuki",
        "Swift",
        "VXi",
        2020,
        450000,
        475000,
        35000,
        "Petrol",
        "Manual",
        "Red",
        "Hatchback",
        5,
        1197,
        "KA01AB1234",
        "MA3EUA61S00123456",
        "used",
        "available",
        "yes",
        "https://example.com/swift-front.jpg",
        "https://example.com/swift-front.jpg | https://example.com/swift-interior.jpg",
        "Touchscreen infotainment | Reverse camera | Alloy wheels | Dual airbags",
        "Single-owner petrol Swift with full service history and clean interiors.",
        "active",
        "ICICI Lombard",
        "2027-03-18",
        "2020 Maruti Suzuki Swift VXi used car",
        "Certified pre-owned Swift VXi in excellent condition with finance options.",
    ],
    [
        "Honda",
        "City",
        "VX CVT",
        2019,
        780000,
        820000,
        42000,
        "Petrol",
        "Automatic",
        "White",
        "Sedan",
        5,
        1498,
        "MH02XY5678",
        "MALFC41CMKM567890",
        "certified_pre_owned",
        "available",
        "no",
        "https://example.com/city-front.jpg",
        "https://example.com/city-front.jpg | https://example.com/city-side.jpg",
        "Sunroof | Cruise control | Rear AC vents | Push button start",
        "Well-maintained automatic sedan with verified documents and dealer warranty.",
        "active",
        "HDFC ERGO",
        "2026-11-22",
        "2019 Honda City VX CVT automatic",
        "Used Honda City automatic with low running and premium features.",
    ],
    [
        "Hyundai",
        "Creta",
        "SX",
        2021,
        1050000,
        1125000,
        28000,
        "Diesel",
        "Manual",
        "Blue",
        "SUV",
        5,
        1493,
        "TN09CD9012",
        "MALPC81ALMM901234",
        "used",
        "reserved",
        "yes",
        "https://example.com/creta-front.jpg",
        "https://example.com/creta-front.jpg | https://example.com/creta-dashboard.jpg",
        "Panoramic sunroof | Ventilated seats | Connected car tech | Six airbags",
        "Feature-rich diesel SUV with verified service record and fast delivery.",
        "expiring_soon",
        "Bajaj Allianz",
        "2026-08-05",
        "2021 Hyundai Creta SX diesel used SUV",
        "Pre-owned Hyundai Creta SX diesel with premium features and inspected stock.",
    ],
];

function csvCell(value: string | number) {
    const text = String(value);
    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

export function buildVehicleUploadCsvTemplate() {
    return [
        VEHICLE_UPLOAD_CSV_HEADERS.map(csvCell).join(","),
        ...VEHICLE_UPLOAD_EXAMPLE_ROWS.map((row) => row.map(csvCell).join(",")),
    ].join("\n");
}

export function downloadVehicleUploadCsvTemplate(filename = "vehicle-inventory-sample.csv") {
    const blob = new Blob([buildVehicleUploadCsvTemplate()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
