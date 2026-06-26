// Applies the landing-page palette (warm cream / ink / bronze) to the public
// car browsing + detail pages so they match the marketing site. Colours only.
export default function CarsLayout({ children }: { children: React.ReactNode }) {
    return <div className="dsp-app-skin min-h-screen">{children}</div>;
}
