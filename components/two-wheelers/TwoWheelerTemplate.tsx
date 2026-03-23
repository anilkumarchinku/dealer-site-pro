"use client"

import brandModelsData from "@/lib/data/brand-models.json"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import {
    Phone, MapPin, Mail, Menu, X, ArrowRight,
    Bike, Zap, RotateCcw, Wrench, CreditCard, ChevronRight,
} from "lucide-react"
import type { TwoWheelerVehicle } from "@/lib/types/two-wheeler"
import { VehicleCard } from "@/components/two-wheelers/VehicleCard"
import { LeadFormModal } from "@/components/two-wheelers/LeadFormModal"
import { WhatsAppButton } from "@/components/ui/WhatsAppButton"
import { getScrapedImageUrls, brandNameToId } from "@/lib/utils/brand-model-images"
import { useSitePrefix } from "@/lib/hooks/useSitePrefix"

// ── Brand color themes — keyed by EXACT brand name stored in DB ───────────────
// Brand names must match brand-models.json exactly (e.g. "Hero MotoCorp" not "Hero")
type BrandTheme = { heroGradient: string; accent: string; accentText: string; btnPrimary: string }

const BRAND_THEMES: Record<string, BrandTheme> = {
    // ── High-volume Indian brands ──────────────────────────────────────────
    "Royal Enfield": {
        heroGradient: "from-[#3D0000] via-[#1A0000] to-black",
        accent: "#D4A017", accentText: "text-[#D4A017]", btnPrimary: "bg-[#D4A017] text-black hover:bg-[#B8861A]",
    },
    "Hero MotoCorp": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#E31E24", accentText: "text-[#E31E24]", btnPrimary: "bg-[#E31E24] text-white hover:bg-[#C41920]",
    },
    "Honda Motorcycle & Scooter India": {
        heroGradient: "from-[#CC0000] via-[#880000] to-black",
        accent: "#ffffff", accentText: "text-red-300", btnPrimary: "bg-white text-[#CC0000] hover:bg-gray-100",
    },
    "TVS Motor Company": {
        heroGradient: "from-[#1B1B8F] via-[#0D0D5C] to-black",
        accent: "#F7B500", accentText: "text-[#F7B500]", btnPrimary: "bg-[#F7B500] text-black hover:bg-[#D4980A]",
    },
    "Bajaj Auto": {
        heroGradient: "from-[#002FA7] via-[#001A6B] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Yamaha India": {
        heroGradient: "from-[#003087] via-[#001E5E] to-black",
        accent: "#E31E24", accentText: "text-red-400", btnPrimary: "bg-[#E31E24] text-white hover:bg-[#C41920]",
    },
    "Suzuki Motorcycle India": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#4FC3F7", accentText: "text-sky-300", btnPrimary: "bg-[#4FC3F7] text-black hover:bg-[#3AACDE]",
    },
    "KTM India": {
        heroGradient: "from-[#CC5200] via-[#882200] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Kawasaki India": {
        heroGradient: "from-[#005500] via-[#003300] to-black",
        accent: "#66CC00", accentText: "text-green-400", btnPrimary: "bg-[#66CC00] text-black hover:bg-[#55AA00]",
    },
    "Husqvarna India": {
        heroGradient: "from-[#0057A8] via-[#003570] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Mahindra Two Wheelers": {
        heroGradient: "from-[#CC0000] via-[#880000] to-black",
        accent: "#003087", accentText: "text-blue-400", btnPrimary: "bg-[#003087] text-white hover:bg-[#002060]",
    },
    // ── Classic / Heritage brands ──────────────────────────────────────────
    "Jawa Motorcycles": {
        heroGradient: "from-[#1A3D1A] via-[#0D200D] to-black",
        accent: "#C8A96E", accentText: "text-[#C8A96E]", btnPrimary: "bg-[#C8A96E] text-black hover:bg-[#A8894E]",
    },
    "Yezdi Motorcycles": {
        heroGradient: "from-[#1A3D1A] via-[#0D200D] to-black",
        accent: "#FFFFFF", accentText: "text-white", btnPrimary: "bg-white text-gray-900 hover:bg-gray-100",
    },
    "Benelli India": {
        heroGradient: "from-[#8B0000] via-[#500000] to-black",
        accent: "#C0C0C0", accentText: "text-gray-300", btnPrimary: "bg-[#8B0000] text-white hover:bg-[#6B0000]",
    },
    // ── European premium brands ────────────────────────────────────────────
    "Aprilia India": {
        heroGradient: "from-[#990000] via-[#660000] to-black",
        accent: "#FFD700", accentText: "text-yellow-400", btnPrimary: "bg-[#990000] text-white hover:bg-[#770000]",
    },
    "Vespa India": {
        heroGradient: "from-[#2E8B57] via-[#1A5C35] to-black",
        accent: "#FFFFFF", accentText: "text-white", btnPrimary: "bg-white text-[#2E8B57] hover:bg-gray-100",
    },
    "Ducati India": {
        heroGradient: "from-[#CC0000] via-[#800000] to-black",
        accent: "#FFFFFF", accentText: "text-red-200", btnPrimary: "bg-[#CC0000] text-white hover:bg-[#AA0000]",
    },
    "BMW Motorrad India": {
        heroGradient: "from-[#1C69D4] via-[#0D4A9E] to-black",
        accent: "#FFFFFF", accentText: "text-white", btnPrimary: "bg-[#1C69D4] text-white hover:bg-[#155BBF]",
    },
    "Triumph India": {
        heroGradient: "from-[#1A1A1A] via-[#0D0D0D] to-black",
        accent: "#C8A96E", accentText: "text-[#C8A96E]", btnPrimary: "bg-[#C8A96E] text-black hover:bg-[#A8894E]",
    },
    "Harley-Davidson India": {
        heroGradient: "from-[#CC5500] via-[#882200] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-black hover:bg-[#E05500]",
    },
    "Moto Guzzi": {
        heroGradient: "from-[#8B0000] via-[#500000] to-black",
        accent: "#C0C0C0", accentText: "text-gray-300", btnPrimary: "bg-[#8B0000] text-white hover:bg-[#6B0000]",
    },
    "Indian Motorcycle": {
        heroGradient: "from-[#8B0000] via-[#500000] to-black",
        accent: "#C8A96E", accentText: "text-[#C8A96E]", btnPrimary: "bg-[#C8A96E] text-black hover:bg-[#A8894E]",
    },
    // ── Budget / value international brands ───────────────────────────────
    "CFMoto India": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#FFD700", accentText: "text-yellow-400", btnPrimary: "bg-[#003087] text-white hover:bg-[#002060]",
    },
    "Keeway India": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Zontes India": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#4FC3F7", accentText: "text-sky-300", btnPrimary: "bg-[#4FC3F7] text-black hover:bg-[#3AACDE]",
    },
    // ── EV brands ──────────────────────────────────────────────────────────
    "Ola Electric": {
        heroGradient: "from-[#CC0000] via-[#880000] to-black",
        accent: "#FFFFFF", accentText: "text-red-300", btnPrimary: "bg-black text-white hover:bg-gray-900",
    },
    "Ather Energy": {
        heroGradient: "from-[#0A0A2E] via-[#05050F] to-black",
        accent: "#00D4FF", accentText: "text-cyan-400", btnPrimary: "bg-[#00D4FF] text-black hover:bg-[#00B8DC]",
    },
    "Bajaj Chetak": {
        heroGradient: "from-[#002FA7] via-[#001A6B] to-black",
        accent: "#00CED1", accentText: "text-teal-400", btnPrimary: "bg-[#00CED1] text-black hover:bg-[#00AEB8]",
    },
    "TVS iQube": {
        heroGradient: "from-[#1B1B8F] via-[#0D0D5C] to-black",
        accent: "#00CED1", accentText: "text-teal-400", btnPrimary: "bg-[#00CED1] text-black hover:bg-[#00AEB8]",
    },
    "Hero Electric": {
        heroGradient: "from-[#003087] via-[#001A4D] to-black",
        accent: "#00FF7F", accentText: "text-green-400", btnPrimary: "bg-[#00CC66] text-white hover:bg-[#00AA55]",
    },
    "Vida (Hero MotoCorp)": {
        heroGradient: "from-[#004D2E] via-[#002D1A] to-black",
        accent: "#00CED1", accentText: "text-teal-400", btnPrimary: "bg-[#00CED1] text-black hover:bg-[#00AEB8]",
    },
    "Revolt Motors": {
        heroGradient: "from-[#CC5200] via-[#882200] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    "Ultraviolette Automotive": {
        heroGradient: "from-[#050520] via-[#020210] to-black",
        accent: "#4169E1", accentText: "text-blue-400", btnPrimary: "bg-[#4169E1] text-white hover:bg-[#3050CC]",
    },
    "Simple Energy": {
        heroGradient: "from-[#0A2E2E] via-[#051818] to-black",
        accent: "#00CED1", accentText: "text-teal-400", btnPrimary: "bg-[#00CED1] text-black hover:bg-[#00AEB8]",
    },
    "Tork Motors": {
        heroGradient: "from-[#CC5200] via-[#882200] to-black",
        accent: "#FF6600", accentText: "text-orange-400", btnPrimary: "bg-[#FF6600] text-white hover:bg-[#E05500]",
    },
    // ── Additional 2W brands (auto-generated from brand-colors.json) ──────
    "Husqvarna Motorcycles": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Triumph Motorcycles": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Moto Morini": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "BSA Motorcycles": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Brixton Motorcycles": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "FB Mondial": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "SYM": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Super Soco": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Segway": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "VinFast": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Lambretta": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Gravton Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Gemopai": { heroGradient: "from-[#003F52] via-[#001B23] to-black", accent: "#00B4EB", accentText: "text-[#00B4EB]", btnPrimary: "bg-[#00B4EB] text-black hover:bg-[#0099C7]" },
    "Benling India": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Tunwal E-Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "e-Sprinto": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Warivo Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Numeros Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Avon E-Vehicles": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Avan Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Motovolt": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Svitch": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Kinetic Green": { heroGradient: "from-[#2B3E17] via-[#121B0A] to-black", accent: "#7BB343", accentText: "text-[#7BB343]", btnPrimary: "bg-[#7BB343] text-black hover:bg-[#689839]" },
    "BGauss": { heroGradient: "from-[#003C53] via-[#001A24] to-black", accent: "#00AEEF", accentText: "text-[#00AEEF]", btnPrimary: "bg-[#00AEEF] text-black hover:bg-[#0094CA]" },
    "GT Force": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Poise": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Vegh Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "One Moto India": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "YObykes": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Li-ions Elektrik": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "NDS Eco Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "iScoot": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "HCD India": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Runr": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Enigma Automobile": { heroGradient: "from-[#594900] via-[#261F00] to-black", accent: "#FFD100", accentText: "text-[#FFD100]", btnPrimary: "bg-[#FFD100] text-black hover:bg-[#D8B100]" },
    "BNC Motor": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Aeroride": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Boom Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Stella Automobili": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Crayon Motors": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Bajaj Chetak Electric": { heroGradient: "from-[#001A3A] via-[#000B19] to-black", accent: "#004DA8", accentText: "text-[#004DA8]", btnPrimary: "bg-[#004DA8] text-white hover:bg-[#00418E]" },
    "TVS iQube Electric": { heroGradient: "from-[#0C152C] via-[#050913] to-black", accent: "#253C80", accentText: "text-[#253C80]", btnPrimary: "bg-[#253C80] text-white hover:bg-[#1F336C]" },
    "Okinawa Autotech": { heroGradient: "from-[#52090C] via-[#230405] to-black", accent: "#EC1C24", accentText: "text-[#EC1C24]", btnPrimary: "bg-[#EC1C24] text-white hover:bg-[#C8171E]" },
    "Ampere (Greaves Electric)": { heroGradient: "from-[#1A3D1C] via-[#0B1A0C] to-black", accent: "#4CAF50", accentText: "text-[#4CAF50]", btnPrimary: "bg-[#4CAF50] text-black hover:bg-[#409444]" },
    "Kabira Mobility": { heroGradient: "from-[#00102F] via-[#000714] to-black", accent: "#003087", accentText: "text-[#003087]", btnPrimary: "bg-[#003087] text-white hover:bg-[#002872]" },
    "Pure EV": { heroGradient: "from-[#001E3A] via-[#000D19] to-black", accent: "#0057A8", accentText: "text-[#0057A8]", btnPrimary: "bg-[#0057A8] text-white hover:bg-[#00498E]" },
    "Matter EV": { heroGradient: "from-[#591C00] via-[#260C00] to-black", accent: "#FF5200", accentText: "text-[#FF5200]", btnPrimary: "bg-[#FF5200] text-white hover:bg-[#D84500]" },
    "Hop Electric": { heroGradient: "from-[#102B11] via-[#061207] to-black", accent: "#2E7D32", accentText: "text-[#2E7D32]", btnPrimary: "bg-[#2E7D32] text-white hover:bg-[#276A2A]" },
    "Okaya EV": { heroGradient: "from-[#00102F] via-[#000714] to-black", accent: "#003087", accentText: "text-[#003087]", btnPrimary: "bg-[#003087] text-white hover:bg-[#002872]" },
    "Oben Electric": { heroGradient: "from-[#00102F] via-[#000714] to-black", accent: "#003087", accentText: "text-[#003087]", btnPrimary: "bg-[#003087] text-white hover:bg-[#002872]" },
    "Lectrix EV": { heroGradient: "from-[#001E3A] via-[#000D19] to-black", accent: "#0057A8", accentText: "text-[#0057A8]", btnPrimary: "bg-[#0057A8] text-white hover:bg-[#00498E]" },
    "River EV": { heroGradient: "from-[#003A1C] via-[#00180C] to-black", accent: "#00A651", accentText: "text-[#00A651]", btnPrimary: "bg-[#00A651] text-white hover:bg-[#008D44]" },
    "Odysse Electric": { heroGradient: "from-[#00102F] via-[#000714] to-black", accent: "#003087", accentText: "text-[#003087]", btnPrimary: "bg-[#003087] text-white hover:bg-[#002872]" },
    "Joy e-bike": { heroGradient: "from-[#002E15] via-[#001309] to-black", accent: "#00843D", accentText: "text-[#00843D]", btnPrimary: "bg-[#00843D] text-white hover:bg-[#007033]" },
    "Komaki": { heroGradient: "from-[#1A1A2E] via-[#0D0D17] to-black", accent: "#FFFFFF", accentText: "text-white", btnPrimary: "bg-white text-black hover:bg-gray-200" },
    "Bounce Infinity": { heroGradient: "from-[#592000] via-[#260D00] to-black", accent: "#FF5C00", accentText: "text-[#FF5C00]", btnPrimary: "bg-[#FF5C00] text-black hover:bg-[#D84E00]" },
    "Quantum Energy": { heroGradient: "from-[#00102F] via-[#000714] to-black", accent: "#003087", accentText: "text-[#003087]", btnPrimary: "bg-[#003087] text-white hover:bg-[#002872]" },
    "Yulu": { heroGradient: "from-[#594B00] via-[#262000] to-black", accent: "#FFD700", accentText: "text-[#FFD700]", btnPrimary: "bg-[#FFD700] text-black hover:bg-[#D8B600]" },
    "Raptee Energy": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "River Mobility": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Jitendra EV": { heroGradient: "from-[#00203B] via-[#000D19] to-black", accent: "#005CAB", accentText: "text-[#005CAB]", btnPrimary: "bg-[#005CAB] text-white hover:bg-[#004E91]" },
    "iVOOMi Energy": { heroGradient: "from-[#00344C] via-[#001620] to-black", accent: "#0097DA", accentText: "text-[#0097DA]", btnPrimary: "bg-[#0097DA] text-white hover:bg-[#0080B9]" },
    "AMO Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Evolet India": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "BattRE Electric": { heroGradient: "from-[#520B0D] via-[#230505] to-black", accent: "#EB2226", accentText: "text-[#EB2226]", btnPrimary: "bg-[#EB2226] text-white hover:bg-[#C71C20]" },
    "Detel EV": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "DAO Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Earth Energy EV": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Oreva": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "iGowise Mobility": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Greta Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Prevail Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "EeVe India": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Pur Energy": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Yakuza Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Avera Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Corrit Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Gaura Electric": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Fidato Evtech": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
    "Hayasa E-Mobility": { heroGradient: "from-[#002755] via-[#001024] to-black", accent: "#0070F3", accentText: "text-[#0070F3]", btnPrimary: "bg-[#0070F3] text-white hover:bg-[#005FCE]" },
}

const DEFAULT_THEME: BrandTheme = {
    heroGradient: "from-gray-900 via-gray-800 to-black",
    accent: "#3B82F6", accentText: "text-blue-400", btnPrimary: "bg-blue-600 text-white hover:bg-blue-700",
}

// ── Brand logo resolution ──────────────────────────────────────────────
const BRAND_NAME_TO_ID: Record<string, string> = {}
    ;[
        ...(brandModelsData.twoWheelers.traditional as { brand: string; brandId: string }[]),
        ...(brandModelsData.twoWheelers.electric as { brand: string; brandId: string }[]),
    ].forEach(b => { BRAND_NAME_TO_ID[b.brand.toLowerCase().trim()] = b.brandId })

// Fallback map for known SVG logos in /assets/logos/2w/
const KNOWN_SVG_LOGOS: Record<string, string> = {
    "royal enfield": "/assets/logos/2w/royal-enfield.svg",
    "hero motocorp": "/assets/logos/2w/hero-motocorp.svg",
    "honda motorcycle & scooter india": "/assets/logos/2w/honda-motorcycles.svg",
    "tvs motor company": "/assets/logos/2w/tvs-motor.svg",
    "bajaj auto": "/assets/logos/2w/bajaj-auto.svg",
    "yamaha india": "/assets/logos/2w/yamaha.svg",
    "suzuki motorcycle india": "/assets/logos/2w/suzuki-motorcycle.svg",
    "ktm india": "/assets/logos/2w/ktm.svg",
    "kawasaki india": "/assets/logos/2w/kawasaki.svg",
    "ather energy": "/assets/logos/2w/ather-energy.svg",
    "ola electric": "/assets/logos/2w/ola-electric.svg",
    "husqvarna india": "/assets/logos/2w/husqvarna.svg",
    "aprilia india": "/assets/logos/2w/aprilia.svg",
    "vespa india": "/assets/logos/2w/vespa.svg",
    "ducati india": "/assets/logos/2w/ducati.svg",
    "bmw motorrad india": "/assets/logos/2w/bmw-motorrad.svg",
    "triumph india": "/assets/logos/2w/triumph.svg",
    "harley-davidson india": "/assets/logos/2w/harley-davidson.svg",
    "cfmoto india": "/assets/logos/2w/cfmoto.png",
}

/** Returns a 2W-specific brand logo path, or empty string if none available.
 *  Callers must handle empty string — never falls back to car brand logos. */
function getBrandLogoSrc(brand: string | null): string {
    if (!brand) return ""
    return KNOWN_SVG_LOGOS[brand.toLowerCase().trim()] ?? ""
}

/**
 * Resolve brand theme with fuzzy fallback.
 * DB stores full names like "Hero MotoCorp" — we try exact match first,
 * then substring match so partial names still resolve.
 */
function getBrandTheme(brand: string | null): BrandTheme {
    if (!brand) return DEFAULT_THEME
    if (BRAND_THEMES[brand]) return BRAND_THEMES[brand]
    const lower = brand.toLowerCase()
    for (const [key, theme] of Object.entries(BRAND_THEMES)) {
        if (lower.includes(key.toLowerCase()) || key.toLowerCase().includes(lower)) {
            return theme
        }
    }
    return DEFAULT_THEME
}

// ── Types ────────────────────────────────────────────────────────────────────

interface Props {
    dealerId: string
    dealerName: string
    phone: string
    email: string
    location: string
    fullAddress: string | null
    primaryBrand: string | null
    logoUrl: string | null
    vehicles: TwoWheelerVehicle[]
    slug: string
}

type FilterTab = "all" | "bike" | "scooter" | "electric"

// ── Helper: first available hero image for a vehicle ─────────────────────────
// Only use dealer-uploaded images — scraped model images are car-only for now.
// When 2W-specific scraped images are available, restore the getScrapedImageUrls fallback.
function getVehicleHeroImage(v: TwoWheelerVehicle): string | null {
    return v.images[0] ?? null
}

// ── Template component ────────────────────────────────────────────────────────

export function TwoWheelerTemplate({
    dealerId, dealerName, phone, email, location, fullAddress,
    primaryBrand, logoUrl, vehicles, slug,
}: Props) {
    const theme = getBrandTheme(primaryBrand)
    const prefix = useSitePrefix(slug)

    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<FilterTab>("all")
    const [leadVehicleId, setLeadVehicleId] = useState<string | null>(null)
    const [leadType, setLeadType] = useState<"best_price" | "test_ride">("best_price")
    const [heroVehicleIdx, setHeroVehicleIdx] = useState(0)

    // Scroll handler — nav goes solid like ModernTemplate
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 60)
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    // Auto-rotate hero vehicle
    useEffect(() => {
        if (vehicles.length === 0) return
        const t = setInterval(() => setHeroVehicleIdx(i => (i + 1) % Math.min(vehicles.length, 3)), 5000)
        return () => clearInterval(t)
    }, [vehicles.length])

    // Filtered vehicles
    const filtered = activeTab === "all"
        ? vehicles
        : activeTab === "electric"
            ? vehicles.filter(v => v.fuel_type === "electric" || v.type === "electric")
            : vehicles.filter(v => v.type === activeTab)

    const tabCounts = {
        all: vehicles.length,
        bike: vehicles.filter(v => v.type === "bike").length,
        scooter: vehicles.filter(v => v.type === "scooter").length,
        electric: vehicles.filter(v => v.fuel_type === "electric" || v.type === "electric").length,
    }

    const navLinks: { label: string; href: string }[] = [
        { label: "Bikes", href: `${prefix}/two-wheelers/bikes` },
        { label: "Scooters", href: `${prefix}/two-wheelers/scooters` },
        ...(tabCounts.electric > 0 ? [{ label: "Electric", href: `${prefix}/two-wheelers/electric` }] : []),
        { label: "Used", href: `${prefix}/two-wheelers/used` },
        { label: "Service", href: `${prefix}/two-wheelers/service` },
        { label: "EMI Calc", href: `${prefix}/two-wheelers/emi-calculator` },
    ]

    const heroVehicle = vehicles[heroVehicleIdx]

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">

            {/* ── Fixed Navigation (ModernTemplate-style) ─────────────────── */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Brand logo + name */}
                        <div className="flex items-center gap-3">
                            <div className="relative w-9 h-9 shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-white/10">
                                {(logoUrl || getBrandLogoSrc(primaryBrand)) ? (
                                    <Image
                                        src={logoUrl || getBrandLogoSrc(primaryBrand)}
                                        alt={primaryBrand ?? dealerName}
                                        fill
                                        className="object-contain"
                                        sizes="36px"
                                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none" }}
                                    />
                                ) : (
                                    <span className="text-white font-bold text-sm">
                                        {(primaryBrand ?? dealerName).charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <span className={`text-lg font-bold transition-colors ${isScrolled ? "text-gray-900" : "text-white"}`}>
                                {dealerName}
                            </span>
                        </div>

                        {/* Desktop nav links */}
                        <div className="hidden md:flex items-center gap-5">
                            {navLinks.map(l => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className={`text-sm font-medium transition-colors ${isScrolled ? "text-gray-600 hover:text-gray-900" : "text-white/80 hover:text-white"
                                        }`}
                                >
                                    {l.label}
                                </Link>
                            ))}
                        </div>

                        {/* Phone + mobile menu */}
                        <div className="flex items-center gap-3">
                            <a
                                href={`tel:${phone}`}
                                className={`hidden md:flex items-center gap-1.5 text-sm font-semibold transition-colors ${isScrolled ? "text-gray-900" : "text-white"
                                    }`}
                            >
                                <Phone className="w-4 h-4" />
                                {phone}
                            </a>
                            <button
                                className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
                                    }`}
                                onClick={() => setMobileMenuOpen(o => !o)}
                                aria-label="Menu"
                            >
                                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t shadow-lg">
                        <div className="px-4 py-3 space-y-1">
                            {navLinks.map(l => (
                                <Link
                                    key={l.label}
                                    href={l.href}
                                    className="block py-2 px-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <a href={`tel:${phone}`} className="block py-2 px-3 text-sm font-medium text-blue-600">
                                <Phone className="inline w-4 h-4 mr-1" />
                                {phone}
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* ── Hero Section (ModernTemplate-style full-screen) ──────────── */}
            <section className={`relative min-h-screen bg-gradient-to-br ${theme.heroGradient} flex flex-col justify-center overflow-hidden`}>
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: "radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">

                        {/* Left: text + CTAs */}
                        <div className="space-y-6">
                            {primaryBrand && (
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest ${theme.accentText} border-current/30 bg-white/5`}>
                                    Authorised {primaryBrand} Dealer
                                </div>
                            )}

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
                                {dealerName}
                            </h1>

                            <p className="text-lg text-white/70 flex items-center gap-2">
                                <MapPin className="w-5 h-5 shrink-0" />
                                {location}
                            </p>

                            <p className="text-white/60 text-base max-w-md">
                                Your trusted 2-Wheeler destination — bikes, scooters & electric vehicles.
                                {vehicles.length > 0 && ` ${vehicles.length}+ models in stock.`}
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <button
                                    onClick={() => { setLeadType("best_price"); setLeadVehicleId("") }}
                                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all ${theme.btnPrimary}`}
                                >
                                    Get Best Price <ArrowRight className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => { setLeadType("test_ride"); setLeadVehicleId("") }}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
                                >
                                    Book Test Ride
                                </button>
                                <Link
                                    href={`${prefix}/two-wheelers/emi-calculator`}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-white/30 text-white hover:bg-white/10 transition-all"
                                >
                                    EMI Calculator
                                </Link>
                            </div>

                            {/* Quick stats */}
                            <div className="flex flex-wrap gap-6 pt-4 border-t border-white/10">
                                {[
                                    { label: "Models", value: `${vehicles.length}+` },
                                    { label: "Brands", value: `${new Set(vehicles.map(v => v.brand)).size}+` },
                                    { label: "Service", value: "Expert" },
                                ].map(s => (
                                    <div key={s.label} className="text-center">
                                        <p className={`text-2xl font-extrabold ${theme.accentText}`}>{s.value}</p>
                                        <p className="text-white/50 text-xs mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: rotating vehicle showcase — only shown when vehicle has an uploaded image */}
                        {heroVehicle && getVehicleHeroImage(heroVehicle) && (
                            <div className="relative">
                                <div className="relative bg-white/5 rounded-3xl border border-white/10 overflow-hidden aspect-[4/3]">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={getVehicleHeroImage(heroVehicle)!}
                                        alt={`${heroVehicle.brand} ${heroVehicle.model}`}
                                        className="w-full h-full object-cover transition-opacity duration-700"
                                    />
                                    {/* Vehicle info overlay */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                        <p className="text-white/70 text-xs uppercase tracking-widest">{heroVehicle.brand}</p>
                                        <p className="text-white font-bold text-xl">{heroVehicle.model}</p>
                                        <p className={`text-lg font-bold mt-1 ${theme.accentText}`}>
                                            ₹{(heroVehicle.ex_showroom_price_paise / 100).toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                {/* Thumbnail row */}
                                {vehicles.length > 1 && (
                                    <div className="flex gap-2 mt-3 justify-center">
                                        {vehicles.slice(0, 3).map((v, i) => (
                                            <button
                                                key={v.id}
                                                onClick={() => setHeroVehicleIdx(i)}
                                                className={`w-3 h-3 rounded-full transition-all ${i === heroVehicleIdx ? "scale-125" : "bg-white/30 hover:bg-white/50"
                                                    }`}
                                                style={i === heroVehicleIdx ? { backgroundColor: theme.accent } : {}}
                                                aria-label={`View ${v.brand} ${v.model}`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronRight className="w-6 h-6 text-white/40 rotate-90" />
                </div>
            </section>

            {/* ── Category tiles ──────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Shop by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Bikes", emoji: "🏍️", href: `${prefix}/two-wheelers/bikes`, count: tabCounts.bike },
                        { label: "Scooters", emoji: "🛵", href: `${prefix}/two-wheelers/scooters`, count: tabCounts.scooter },
                        ...(tabCounts.electric > 0 ? [{ label: "Electric", emoji: "⚡", href: `${prefix}/two-wheelers/electric`, count: tabCounts.electric }] : []),
                        { label: "Used", emoji: "🔄", href: `${prefix}/two-wheelers/used`, count: null },
                    ].map(c => (
                        <Link
                            key={c.label}
                            href={c.href}
                            className="group flex flex-col items-center gap-3 p-6 bg-white border border-gray-200 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
                            <span className="text-4xl">{c.emoji}</span>
                            <span className="font-semibold text-gray-900">{c.label}</span>
                            {c.count != null && c.count > 0 && (
                                <span className="text-xs text-gray-500">{c.count} models</span>
                            )}
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Inventory Section ────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Our Inventory</h2>
                        <p className="text-gray-500 text-sm mt-1">{vehicles.length} models available</p>
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
                        {([
                            { key: "all", label: `All (${tabCounts.all})` },
                            { key: "bike", label: `Bikes (${tabCounts.bike})` },
                            { key: "scooter", label: `Scooters (${tabCounts.scooter})` },
                            { key: "electric", label: `Electric (${tabCounts.electric})` },
                        ] as { key: FilterTab; label: string }[]).map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab.key
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-600 hover:text-gray-900"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {filtered.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map(v => (
                            <VehicleCard
                                key={v.id}
                                vehicle={v}
                                slug={slug}
                                brandColor={theme.accent}
                                onLead={vid => { setLeadType("best_price"); setLeadVehicleId(vid) }}
                                onCompare={undefined}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-gray-400">
                        <p className="text-lg font-medium">No vehicles in this category yet.</p>
                        <p className="text-sm mt-1">Check back soon or contact us directly.</p>
                    </div>
                )}
            </section>

            {/* ── Services strip ───────────────────────────────────────────── */}
            <section className="bg-white py-16 px-4 border-t border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Why Buy From Us</h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { Icon: Wrench, title: "Expert Service", text: "Factory-trained technicians for all 2W brands" },
                            { Icon: CreditCard, title: "Easy Finance", text: "EMI starting ₹999/month — HDFC, Bajaj & more" },
                            { Icon: RotateCcw, title: "Exchange Offer", text: "Best exchange value for your old bike or scooter" },
                            ...(tabCounts.electric > 0 ? [{ Icon: Zap, title: "EV Specialists", text: "Test rides & charging demos for electric models" }] : []),
                        ].map(s => (
                            <div key={s.title} className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.accent + "15" }}>
                                    <s.Icon className="w-6 h-6" style={{ color: theme.accent }} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{s.title}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{s.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Contact Section ──────────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid md:grid-cols-2 gap-10 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
                        <p className="text-gray-500 mb-8">Our team is here to help you find the perfect ride.</p>
                        <div className="space-y-4">
                            <a href={`tel:${phone}`} className="flex items-center gap-3 text-gray-700 hover:text-gray-900 group">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:opacity-80 transition-opacity" style={{ backgroundColor: theme.accent + "15" }}>
                                    <Phone className="w-5 h-5" style={{ color: theme.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Call Us</p>
                                    <p className="font-semibold">{phone}</p>
                                </div>
                            </a>
                            <a href={`mailto:${email}`} className="flex items-center gap-3 text-gray-700 hover:text-gray-900 group">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:opacity-80 transition-opacity" style={{ backgroundColor: theme.accent + "15" }}>
                                    <Mail className="w-5 h-5" style={{ color: theme.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Email</p>
                                    <p className="font-semibold">{email}</p>
                                </div>
                            </a>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: theme.accent + "15" }}>
                                    <MapPin className="w-5 h-5" style={{ color: theme.accent }} />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400">Address</p>
                                    <p className="font-semibold">{fullAddress ?? location}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick actions */}
                    <div className="grid grid-cols-1 gap-4">
                        <button
                            onClick={() => { setLeadType("best_price"); setLeadVehicleId("") }}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm transition-all ${theme.btnPrimary}`}
                        >
                            Get Best Price Quote
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => { setLeadType("test_ride"); setLeadVehicleId("") }}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm bg-white border-2 text-gray-900 hover:opacity-90 transition-all"
                            style={{ borderColor: theme.accent, color: theme.accent }}
                        >
                            Book a Test Ride
                            <Bike className="w-4 h-4" />
                        </button>
                        <Link
                            href={`${prefix}/two-wheelers/service`}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition-all"
                        >
                            Book Service Appointment
                            <Wrench className="w-4 h-4" />
                        </Link>
                        <Link
                            href={`${prefix}/two-wheelers/emi-calculator`}
                            className="w-full flex items-center justify-between px-6 py-4 rounded-2xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:border-gray-400 transition-all"
                        >
                            Calculate EMI
                            <CreditCard className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="bg-white border-t border-gray-200 py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Brand row */}
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                        <div className="relative w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-white flex items-center justify-center">
                            {(logoUrl || getBrandLogoSrc(primaryBrand)) ? (
                                <Image
                                    src={logoUrl || getBrandLogoSrc(primaryBrand)}
                                    alt={primaryBrand ?? dealerName}
                                    fill
                                    className="object-contain p-1"
                                    sizes="48px"
                                    onError={e => { (e.target as HTMLImageElement).parentElement!.style.display = "none" }}
                                />
                            ) : (
                                <span className="text-gray-700 font-bold text-lg">
                                    {(primaryBrand ?? dealerName).charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 text-lg">{dealerName}</p>
                            <p className="text-sm text-gray-500">{location}</p>
                        </div>
                    </div>
                    <p className="text-gray-400 text-xs text-center">
                        Powered by <span className="font-semibold" style={{ color: theme.accent }}>DealerSite Pro</span>
                    </p>
                </div>
            </footer>

            {/* ── WhatsApp floating button ──────────────────────────────────── */}
            <WhatsAppButton phone={phone} message={`Hi ${dealerName}, I'm interested in your 2-Wheeler inventory.`} />

            {/* ── Lead modal ────────────────────────────────────────────────── */}
            <LeadFormModal
                dealerId={dealerId}
                vehicleId={leadVehicleId ?? undefined}
                leadType={leadType}
                title={leadType === "test_ride" ? "Book Test Ride" : "Get Best Price"}
                isOpen={leadVehicleId !== null}
                onClose={() => setLeadVehicleId(null)}
            />
        </div>
    )
}
