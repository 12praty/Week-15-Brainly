import { type ReactElement } from "react";

interface SidebarItemProps {
  text: string;
  icon: ReactElement;
}

export function SidebarItem({ text, icon }: SidebarItemProps) {
  return (
    <div className="flex items-center">
      <div className="mr-3">
        {icon}
      </div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}