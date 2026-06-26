import { redirect } from 'next/navigation'

export default async function BikesPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    redirect(`/sites/${slug}/two-wheelers/new?category=bike`)
}
