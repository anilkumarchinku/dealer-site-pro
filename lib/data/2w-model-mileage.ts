/**
 * Static mileage lookup for 2W models whose JSON data files
 * do not include mileage data (Hero, Honda, Kawasaki, Indian Motorcycle, etc.)
 * Keyed as "Brand Model" — matches exactly how they appear in brand-models.json.
 * Values are ARAI/claimed mileage in kmpl; null = electric/no data.
 */
export const TWO_WHEELER_MODEL_MILEAGE: Record<string, number | null> = {

    // ── Hero MotoCorp ──────────────────────────────────────────────────────────
    "Hero MotoCorp HF 100":                 72,
    "Hero MotoCorp HF Deluxe":              70,
    "Hero MotoCorp Splendor Plus":          79,
    "Hero MotoCorp Splendor Plus Xtec":     79,
    "Hero MotoCorp Splendor Plus Xtec 2.0": 79,
    "Hero MotoCorp Super Splendor Xtec":    62,
    "Hero MotoCorp Passion Plus":           65,
    "Hero MotoCorp Glamour":                57,
    "Hero MotoCorp Glamour Xtec":           57,
    "Hero MotoCorp Glamour X 125":          57,
    "Hero MotoCorp Xtreme 125R":            56,
    "Hero MotoCorp Xtreme 160R":            46,
    "Hero MotoCorp Xtreme 160R 4V":         42,
    "Hero MotoCorp Xtreme 250R":            30,
    "Hero MotoCorp XPulse 200 4V":          39,
    "Hero MotoCorp XPulse 200":             39,
    "Hero MotoCorp XPulse 210":             35,
    "Hero MotoCorp Xpulse 200 4V":          39,
    "Hero MotoCorp Karizma XMR":            35,
    "Hero MotoCorp Mavrick 440":            28,
    "Hero MotoCorp Pleasure Plus":          52,
    "Hero MotoCorp Pleasure Plus Xtec":     52,
    "Hero MotoCorp Destini 125":            51,
    "Hero MotoCorp Destini Prime":          51,
    "Hero MotoCorp Xoom 110":               55,
    "Hero MotoCorp Xoom 125":               55,
    "Hero MotoCorp Xoom 160":               45,

    // ── Honda Motorcycle & Scooter India ──────────────────────────────────────
    "Honda Motorcycle & Scooter India SP 125":     67,
    "Honda Motorcycle & Scooter India Shine 125":  60,
    "Honda Motorcycle & Scooter India Unicorn":    55,
    "Honda Motorcycle & Scooter India CB125 Hornet": 50,
    "Honda Motorcycle & Scooter India SP160":      47,
    "Honda Motorcycle & Scooter India CB300F":     35,
    "Honda Motorcycle & Scooter India Hness CB350": 37,
    "Honda Motorcycle & Scooter India CB350RS":    37,
    "Honda Motorcycle & Scooter India NX500":      20,
    "Honda Motorcycle & Scooter India CB650R":     20,
    "Honda Motorcycle & Scooter India CBR650R":    20,
    "Honda Motorcycle & Scooter India CB750 Hornet": 18,
    "Honda Motorcycle & Scooter India Transalp XL750": 18,
    "Honda Motorcycle & Scooter India CB1000 Hornet": 16,
    "Honda Motorcycle & Scooter India CBR1000RR-R Fireblade": 14,
    "Honda Motorcycle & Scooter India Goldwing Tour": 14,
    "Honda Motorcycle & Scooter India Activa 110": 60,
    "Honda Motorcycle & Scooter India Activa 125": 60,
    "Honda Motorcycle & Scooter India Activa e":   null, // EV
    "Honda Motorcycle & Scooter India Dio":        58,
    "Honda Motorcycle & Scooter India Dio 125":    55,
    "Honda Motorcycle & Scooter India QC1":        null, // EV
    "Honda Motorcycle & Scooter India X-ADV 750":  22,

    // ── Kawasaki India ────────────────────────────────────────────────────────
    "Kawasaki India W175":       50,
    "Kawasaki India Z400":       22,
    "Kawasaki India Ninja 400":  22,
    "Kawasaki India Z650":       19,
    "Kawasaki India Ninja 650":  19,
    "Kawasaki India Versys 650": 19,
    "Kawasaki India Z900":       17,
    "Kawasaki India Z900RS":     17,
    "Kawasaki India Ninja ZX-4RR": 17,
    "Kawasaki India Ninja ZX-6R":  14,
    "Kawasaki India Versys 1000":  14,
    "Kawasaki India Ninja ZX-10R": 12,
    "Kawasaki India Ninja H2":     8,
    "Kawasaki India Ninja H2R":    8,
    "Kawasaki India Vulcan S":     21,
    "Kawasaki India W800":         22,

    // ── Indian Motorcycle ─────────────────────────────────────────────────────
    "Indian Motorcycle Scout Rogue":  15,
    "Indian Motorcycle Scout Bobber": 15,
    "Indian Motorcycle FTR":          15,
    "Indian Motorcycle Challenger":   10,
    "Indian Motorcycle Chief":        12,
    "Indian Motorcycle Chieftain":    11,
    "Indian Motorcycle Pursuit":      10,

    // ── Komaki ────────────────────────────────────────────────────────────────
    "Komaki XGT X4":   null, // EV
    "Komaki M5":       null, // EV
    "Komaki XGT KM":   null, // EV

    // ── Okinawa Autotech ─────────────────────────────────────────────────────
    "Okinawa Autotech R30":       null, // EV
    "Okinawa Autotech Praisepro": null, // EV
    "Okinawa Autotech Okhi-90":   null, // EV
}
