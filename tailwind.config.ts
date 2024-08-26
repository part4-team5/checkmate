/* eslint-disable import/no-anonymous-default-export */
/** @type {import("tailwindcss").Config} */

// eslint-disable-next-line import/no-extraneous-dependencies
import plugin from "tailwindcss/plugin";

export default {
	theme: {
		screens: {
			tablet: "768px",
			desktop: "1200px",
		},
		colors: {
			brand: {
				primary: "#10B981",
				secondary: "#34D399",
				tertiary: "#A3E635",
			},
			point: {
				purple: "#A855F7",
				blue: "#3B82F6",
				cyan: "#06B6D4",
				pink: "#EC4899",
				rose: "#F43F5E",
				orange: "#F97316",
				yellow: "#EAB308",
			},
			landing: {
				primary: "var(--landing-primary)",
				secondary: "var(--landing-secondary)",
				tertiary: "var(--landing-tertiary)",
				quaternary: "var(--landing-quaternary)",
				quinary: "var(--landing-quinary)",
				Senary: "var(--landing-Senary)",
				Septenary: "var(--landing-Septenary)",
				border: "var(--landing-border)",
				inverse: "var(--landing-inverse)",
			},
			background: {
				primary: "var(--background-primary)",
				secondary: "var(--background-secondary)",
				tertiary: "var(--background-tertiary)",
				quaternary: "var(--background-quaternary)",
				quinary: "var(--background-quinary)",
				Senary: "var(--background-Senary)",
				list: "var(--background-list)",
				border: "var(--landing-line)",
				inverse: "var(--landing-inverse)",
			},
			board: {
				primary: "var(--board-primary)",
				secondary: "var(--board-secondary)",
				tertiary: "var(--board-tertiary)",
				quaternary: "var(--board-quaternary)",
			},
			interaction: {
				inactive: "#94A3B8",
				pressed: "#047857",
				hover: "var(--background-hover)",
				focus: "#10B981",
			},
			border: {
				primary: "var(--border-primary)",
			},
			text: {
				primary: "var(--text-primary)",
				secondary: "var(--text-secondary)",
				tertiary: "#E2E8F0",
				default: "#64748B",
				inverse: "#FFFFFF",
				disabled: "#94A3B8",
				emerald: "#10B981",
				lime: "#A3E635",
			},
			status: {
				danger: "#EF4444",
			},
			icon: {
				primary: "#64748B",
				inverse: "#F8FAFC",
				brand: "#10B981",
			},
			black: "#000000",
			white: "#FFFFFF",
			transparent: "transparent",
		},
		fontSize: {
			"3xl": ["32px", "38px"],
			"2xl": ["24px", "28px"],
			xl: ["20px", "24px"],
			"2lg": ["18px, 21px"],
			lg: ["16px", "19px"],
			md: ["14px", "17px"],
			sm: ["13px", "16px"],
			xs: ["12px", "14px"],
		},
		extend: {
			backgroundImage: {
				"conic-gradient": "conic-gradient(from 0deg, #10b981, #cef57e, #10b981)",
			},
			keyframes: {
				scaleUp: {
					"0%": { transform: "scale(1)" },
					"100%": { transform: "scale(1.2)" },
				},
			},
			animation: {
				scaleUp: "scaleUp 0.2s ease-in-out",
				sparkle: "sparkle 0.6s ease-in-out",
			},
		},
	},
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}", "./stories/**/*.{js,ts,jsx,tsx}"],
	plugins: [
		plugin(({ addUtilities, addVariant }) => {
			addUtilities({
				".scrollbar-hide": {
					"scrollbar-width": "none",
					"-ms-overflow-style": "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},
			});
			addVariant("scrollbar", "&::-webkit-scrollbar");
			addVariant("scrollbar-thumb", "&::-webkit-scrollbar-thumb");
		}),
	],
};
