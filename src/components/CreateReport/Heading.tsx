import React from "react";
import type { IconType } from "react-icons";

type HeadingProps = {
    title: string;
    icon?: IconType;
};

const Heading = ({ title, icon: Icon }: HeadingProps) => {
    return (
        <div className="flex items-center gap-2">
            {Icon && <Icon size={20} className="text-primary" />}
            <span className="text-lg font-semibold">{title}</span>
        </div>
    );
};

export default Heading;