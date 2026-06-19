import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <p className="text-5xl font-black tracking-tight text-gray-900">404</p>
                <h2 className="mt-3 text-xl font-bold text-gray-900">Page not found</h2>
                <p className="mt-2 text-gray-600">
                    The page you&apos;re looking for doesn&apos;t exist or may have moved.
                </p>
                <Link
                    href="/"
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-blue-700"
                >
                    Back to home
                </Link>
            </div>
        </div>
    );
}
