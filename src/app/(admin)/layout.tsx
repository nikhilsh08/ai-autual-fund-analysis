import React from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Tag,
    Settings,
    LogOut
} from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-zinc-200 hidden md:flex flex-col">
                <div className="p-6">
                    <Link href="/admin" className="text-xl font-bold tracking-tight text-zinc-900">
                        Admin Panel
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <NavItem href="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" />
                    <NavItem href="/admin/courses" icon={<BookOpen size={20} />} label="Courses" />
                    <NavItem href="/admin/users" icon={<Users size={20} />} label="Users" />
                    <NavItem href="/admin/coupons" icon={<Tag size={20} />} label="Coupons" />
                    <NavItem href="/admin/settings" icon={<Settings size={20} />} label="Settings" />
                </nav>

                <div className="p-4 border-t border-zinc-200">
                    <button className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-zinc-500 hover:text-red-600 transition-colors w-full rounded-md hover:bg-red-50">
                        <LogOut size={20} />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto max-h-screen">
                {children}
            </main>
        </div>
    );
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-600 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
        >
            {icon}
            {label}
        </Link>
    );
}
