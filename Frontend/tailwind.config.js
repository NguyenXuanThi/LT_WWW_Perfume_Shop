/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#b56576',
                    light: '#f4acb7',
                    dark: '#8d344a',
                },
            },
        },
    },
    plugins: [],
}
