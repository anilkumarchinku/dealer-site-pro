// Applies the landing-page palette (warm cream / ink / bronze) to the public
// privacy page so it matches the marketing site. Colours only.
export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
    return <div className="dsp-app-skin min-h-screen">{children}</div>;
}
