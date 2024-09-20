import { Link, usePage } from "@inertiajs/react";

export default function Pagination({ links }) {
    const { url } = usePage();
    const currentUrl = new URL(url, window.location.origin);

    return (
        <nav className="mt-12 mb-12 text-center">
            {links
                .filter(
                    (link) => link.label !== "&laquo; السابق" && link.label !== "التالي &raquo;"
                )
                .map((link, index) => {
                    const linkUrl = link.url
                        ? new URL(link.url, window.location.origin)
                        : null;

                    if (linkUrl) {
                        linkUrl.search = currentUrl.search;
                        linkUrl.searchParams.set("page", link.label);
                    }

                    return (
                        <span key={index}>
                            {link.url ? (
                                <Link
                                    preserveScroll
                                    href={linkUrl ? linkUrl.toString() : "#"}
                                    className={
                                        "inline-block py-2 px-3 rounded-lg text-gray-500 text-xs " +
                                        (link.active ? "bg-gray-950 " : " ") +
                                        "hover:bg-gray-950"
                                    }
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ) : (
                                <span
                                    className="inline-block px-3 py-2 text-xs text-gray-500 rounded-lg cursor-not-allowed"
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            )}
                        </span>
                    );
                })}
        </nav>
    );
}
