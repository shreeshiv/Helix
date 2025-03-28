"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, MessageSquare, History, Plus, Command, Settings, Briefcase, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSearchMode } from "@/contexts/search-mode-context";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/",
  },
  {
    label: "Candidates",
    icon: Users,
    href: "/candidates",
  },
  {
    label: "Sequences",
    icon: MessageSquare,
    href: "/sequences",
  },
  {
    label: "History",
    icon: History,
    href: "/history",
  },
];

interface SearchMode {
  id: string;
  label: string;
  icon: React.ElementType;
}

const searchModes: SearchMode[] = [
  {
    id: "roles",
    label: "Role-based",
    icon: Briefcase,
  },
  {
    id: "skills",
    label: "Skills-based",
    icon: GraduationCap,
  },
  {
    id: "custom",
    label: "Custom",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeSearchModes, toggleSearchMode } = useSearchMode();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-zinc-900/50 text-zinc-100">
      <div className="px-3 py-2 flex-1">
        <div className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">
            helix
            <span className="text-blue-500">.</span>
          </h1>
        </div>
        <div className="space-y-1">
          <div className="mb-4">
            <button className="flex items-center w-full p-3 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition">
              <Plus className="h-4 w-4 mr-2" />
              New Sequence
              <kbd className="ml-auto text-xs text-blue-200 font-mono">
                <span className="flex gap-1">
                  <Command className="h-3 w-3" />
                  K
                </span>
              </kbd>
            </button>
          </div>

          <nav className="flex flex-col space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-zinc-800/50 rounded-lg transition",
                  pathname === route.href ? "bg-zinc-800/50 text-blue-400" : "text-zinc-400"
                )}
              >
                <route.icon className="h-4 w-4 mr-2" />
                {route.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="px-3 py-2 border-t border-zinc-800">
        <h2 className="px-4 text-xs font-semibold text-zinc-400 mb-2">OUTREACH MODE</h2>
        <div className="space-y-1">
          {searchModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => toggleSearchMode(mode.id)}
              className={cn(
                "flex items-center w-full p-3 text-sm font-medium rounded-lg transition",
                "hover:bg-zinc-800/50",
                activeSearchModes.has(mode.id) 
                  ? "bg-zinc-800/50 text-white" 
                  : "text-zinc-400"
              )}
            >
              <mode.icon className={cn(
                "h-4 w-4 mr-2",
                activeSearchModes.has(mode.id) ? "text-blue-400" : ""
              )} />
              {mode.label}
              <div className={cn(
                "ml-auto w-9 h-5 rounded-full transition-colors",
                activeSearchModes.has(mode.id) ? "bg-blue-600" : "bg-zinc-700"
              )}>
                <div className={cn(
                  "h-4 w-4 rounded-full bg-white transform transition-transform mt-0.5",
                  activeSearchModes.has(mode.id) ? "translate-x-4 ml-0.5" : "translate-x-0.5"
                )} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 