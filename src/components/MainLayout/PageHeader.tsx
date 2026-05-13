import { Breadcrumbs } from "./Breadcrumbs";

type BreadcrumbItem = {
    label: string;
    active?: boolean;
};

type PageHeaderProps = {
    title: string;
    subtitle?: string;
    breadcrumbs?: BreadcrumbItem[];
};

export function PageHeader({
    title,
    subtitle,
    breadcrumbs,
}: PageHeaderProps) {
    return (
        <div className="">

            {/* Use existing Breadcrumbs component */}
            {breadcrumbs && breadcrumbs.length > 0 && (
                <div className="mb-2">
                    <Breadcrumbs items={breadcrumbs} />
                </div>
            )}

            {/* Title */}
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                {title}
            </h1>

            {/* Subtitle */}
            {subtitle && (
                <p className="mt-2 text-gray-500 leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
}