import React from 'react'


export default function TopBar({ username = 'User', onLogout, onOpenSidebar }) {
    return (
        <header className="w-full bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <button
                            onClick={onOpenSidebar}
                            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            aria-label="Open menu"
                        >
                            {/* simple hamburger */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>


                        {/* Logo / App name */}
                        <div className="flex items-center gap-2">
                            <div className="w-9 h-9 rounded-md bg-emerald-600 flex items-center justify-center text-white font-bold">PFT</div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-semibold text-emerald-700">Personal Finance Tracker</div>
                                <div className="text-xs text-gray-500">Manage your money, simply</div>
                            </div>
                        </div>
                    </div>


                    <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-700">Hi, <span className="font-medium">{username}</span>!</div>
                        <button
                            onClick={onLogout}
                            className="px-3 py-1 rounded-md bg-red-500 text-white text-sm hover:bg-red-600"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}