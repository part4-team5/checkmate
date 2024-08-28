"use client";

import Icon from "@/app/_icons";
import Cookie from "@/app/_utils/Cookie";
import { useState } from "react";

export default function DarkModeToggle() {
	const [isDarkMode, setDarkMode] = useState(Cookie.get("theme") === null ? true : Cookie.get("theme") === "dark");

	const toggleDarkMode = () => {
		setDarkMode(!isDarkMode);
		if (isDarkMode) {
			document.documentElement.classList.remove("dark");
			Cookie.set("theme", "light");
		} else {
			document.documentElement.classList.add("dark");
			Cookie.set("theme", "dark");
		}
	};

	return (
		<button type="button" onClick={toggleDarkMode} aria-label="DarkMode" className="ml-2 rounded-full bg-background-tertiary p-2 text-lg font-medium">
			{!isDarkMode ? <Icon.Light width={24} height={24} /> : <Icon.Dark width={24} height={24} />}
		</button>
	);
}
