import { Link } from '@inertiajs/react';

export default function SideNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'flex items-center px-8 gap-2 p-4 text-base text-white hover:text-red-100 dark:hover:text-red-800 bg-indigoBlue dark:bg-gray-900 dark:text-white ' +
                (active
                    ? ' dark:border-white text-gray-900 dark:text-gray-100 bg-indigo-700 dark:bg-indigo-600 '
                    : '') +
                className
            }
        >
            {children}
        </Link>
    );
}
