// Applies the landing-page palette (warm cream / ink / bronze) to the public
// bike browsing + detail pages so they match the marketing site. Colours only.
export default function BikesLayout({ children }: { children: React.ReactNode }) {
    return <div className="dsp-app-skin min-h-screen">{children}</div>;
}
