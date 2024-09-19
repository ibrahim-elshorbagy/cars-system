import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggleButton = () => {
    const [theme, setTheme] = useState(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") || "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <div className="flex items-center justify-center p-2">
            <button
                onClick={toggleTheme}
                className="relative w-16 h-8 transition duration-300 ease-in-out bg-gray-100 rounded-full dark:bg-gray-900"
            >
                <div
                    className={`absolute top-0.5 left-0.5 w-7 h-7 transition-transform transform bg-white rounded-full dark:translate-x-8`}
                ></div>
                <FaSun className="absolute top-1.5 left-1.5 text-yellow-500" />
                <FaMoon className="absolute top-1.5 right-1.5 text-gray-500" />
            </button>
        </div>
    );
};

export default ThemeToggleButton;
