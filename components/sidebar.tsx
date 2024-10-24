"use client";

import { cn } from "@/lib/utils";
import {
  ChartGantt,
  Code,
  ImageIcon,
  LayoutDashboard,
  MessageSquare,
  Music,
  NotebookPen,
  Settings,
  VideoIcon,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FreeCounter } from "./free-counter";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Conversation",
    icon: MessageSquare,
    href: "/conversation",
    color: "text-violet-500",
  },
  {
    label: "Code generation",
    icon: Code,
    href: "/code",
    color: "text-green-500",
  },
  {
    label: "Interview Prep",
    icon: NotebookPen,
    href: "/interview",
    color: "text-pink-500",
  },
  {
    label: "Career Guide",
    icon: VideoIcon,
    href: "/career",
    color: "text-orange-500",
  },
  {
    label: "Daily Planner",
    icon: ChartGantt,
    href: "/planner",
    color: "text-emerald-500",
  },

  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];
interface SidebarProps {
  apiLimitCount: number;
}
const Sidebar = ({ apiLimitCount = 0 }: SidebarProps) => {
  const pathname = usePathname();
  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link
          href="/dashboard"
          className="flex items-center justify-center mb-10"
        >
          <Image alt="title" width={180} height={40} src="/logo.png" />
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              href={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "bg-white/10 text-white"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      <FreeCounter apiLimitCount={apiLimitCount} />
    </div>
  );
};

export default Sidebar;
