// Applies the landing-page palette (warm cream / ink / bronze) to the public
// tools pages (EMI, valuation, on-road price, insurance) so they match the
// marketing site. Colours only.
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
    return <div className="dsp-app-skin min-h-screen">{children}</div>;
}
