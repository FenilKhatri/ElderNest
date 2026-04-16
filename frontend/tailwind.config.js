
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    extend: {
        animation: {
            shimmer: "shimmer 1.5s infinite",
        },
        keyframes: {
            shimmer: {
                "0%": { backgroundPosition: "-200% 0" },
                "100%": { backgroundPosition: "200% 0" },
            },
        },
    }
};