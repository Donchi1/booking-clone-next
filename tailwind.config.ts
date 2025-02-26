import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
			primary: {
				DEFAULT: '#2563eb',
				dark: 'var(--primary-dark)',
				gray: "#4b5563d9",
				white: "#ffffff",
				light: "#3b82f6",
				red: "#ef4444"
			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}

  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
