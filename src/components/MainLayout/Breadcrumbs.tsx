type BreadcrumbItem = {
    label: string;
    active?: boolean;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex gap-2 text-[10px] font-bold tracking-widest uppercase">
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    <span
                        className={
                            item.active
                                ? "text-primary"
                                : "text-gray-400"
                        }
                    >
                        {item.label}
                    </span>

                    {index < items.length - 1 && (
                        <span className="text-gray-300">/</span>
                    )}
                </span>
            ))}
        </nav>
    );
}