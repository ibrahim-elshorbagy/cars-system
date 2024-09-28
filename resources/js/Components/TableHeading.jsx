import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";

export default function TableHeading({
    name,
    sortable = true,
    sort_field = null,
    sort_direction = null,
    sortChanged = () => {},
    children,
}) {
    return (
        <th onClick={() => sortChanged(name)} className="cursor-pointer">
            <div className="flex items-center justify-between gap-1 p-3">
                {children}
                {sortable && (
                    <div>
                        <ChevronUpIcon
                            className={
                                "w-4 " +
                                (sort_field === name && sort_direction === "asc"
                                    ? "text-black dark:text-white"  // Light: black, Dark: white
                                    : "text-gray-400 dark:text-gray-500") // Default color in light and dark modes
                            }
                        />
                        <ChevronDownIcon
                            className={
                                "w-4 -mt-2 " +
                                (sort_field === name && sort_direction === "desc"
                                    ? "text-black dark:text-white"  // Light: black, Dark: white
                                    : "text-gray-400 dark:text-gray-500")  // Default color in light and dark modes
                            }
                        />
                    </div>
                )}
            </div>
        </th>
    );
}
