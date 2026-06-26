// Applies the landing-page palette (warm cream / ink / bronze) to the public
// sell pages so they match the marketing site. Colours only.
export default function SellLayout({ children }: { children: React.ReactNode }) {
    return <div className="dsp-app-skin min-h-screen">{children}</div>;
}
