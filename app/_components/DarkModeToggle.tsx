"use client";

import Icon from "@/app/_icons";
import Cookie from "@/app/_utils/Cookie";
import { useState } from "react";

export default function DarkModeToggle() {
	const [darkMode, setDarkMode] = useState(Cookie.get("theme") === "dark");

	const toggleDarkMode = () => {
		setDarkMode(!darkMode);
		if (darkMode) {
			document.documentElement.classList.remove("dark");
			Cookie.set("theme", "light");
		} else {
			document.documentElement.classList.add("dark");
			Cookie.set("theme", "dark");
		}
	};

	return (
		<button type="button" onClick={toggleDarkMode} aria-label="DarkMode" className="ml-2 rounded-full bg-background-tertiary p-2 text-lg font-medium">
			{!darkMode ? <Icon.Light width={24} height={24} /> : <Icon.Dark width={24} height={24} />}
		</button>
	);
}
