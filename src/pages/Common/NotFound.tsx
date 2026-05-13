export function NotFound() {
    return (
        <div className="h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-6xl font-extrabold">404</h1>
            <p className="text-gray-500 mt-2">Page not found</p>

            <a
                href="/"
                className="mt-6 px-4 py-2 bg-black text-white rounded-lg"
            >
                Go Home
            </a>
        </div>
    );
}