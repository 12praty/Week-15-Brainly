import { Logo } from "../../icons/Logo";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { SidebarItem } from "./SidebarItem";
import { useState } from "react";

interface SidebarProps {
  onFilterChange?: (filter: "all" | "youtube" | "twitter") => void;
  activeFilter?: "all" | "youtube" | "twitter";
}

export function Sidebar({ onFilterChange, activeFilter = "all" }: SidebarProps) {
  const [selectedFilter, setSelectedFilter] = useState<"all" | "youtube" | "twitter">(activeFilter);

  const handleFilterClick = (filter: "all" | "youtube" | "twitter") => {
    setSelectedFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <div className="hidden lg:block h-screen bg-white border-r w-72 fixed left-0 top-0 px-6 py-4">
      <h1 className="flex text-2xl py-2 items-center">
        <div className="pr-2">
          <Logo />
        </div>
        Brainly
      </h1>
      
      <div className="pt-8">
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4 px-2">
          Filter Content
        </h3>
        
        <div 
          className={`cursor-pointer mb-3 p-2 rounded-lg transition-colors duration-200 ${
            selectedFilter === "all" 
              ? "bg-purple-100 text-purple-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleFilterClick("all")}
        >
          <SidebarItem 
            text="All Content" 
            icon={
              <div className="w-5 h-5 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            } 
          />
        </div>

        <div 
          className={`cursor-pointer mb-3 p-2 rounded-lg transition-colors duration-200 ${
            selectedFilter === "youtube" 
              ? "bg-red-100 text-red-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleFilterClick("youtube")}
        >
          <SidebarItem 
            text="YouTube" 
            icon={
              <div className="w-5 h-5 flex items-center justify-center">
                <YoutubeIcon />
              </div>
            } 
          />
        </div>

        <div 
          className={`cursor-pointer mb-3 p-2 rounded-lg transition-colors duration-200 ${
            selectedFilter === "twitter" 
              ? "bg-blue-100 text-blue-700" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
          onClick={() => handleFilterClick("twitter")}
        >
          <SidebarItem 
            text="Twitter" 
            icon={
              <div className="w-5 h-5 flex items-center justify-center">
                <TwitterIcon />
              </div>
            } 
          />
        </div>
      </div>
    </div>
  );
}
