import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/dashboard/TopBar'
import Sidebar from '../components/dashboard/Sidebar'
import Overview from '../components/dashboard/overview/Overview'
import Transactions from '../components/dashboard/transactions/Transactions'
import Budgets from '../components/dashboard/budgets/Budgets'
import Settings from '../components/dashboard/Settings'


export default function Dashboard() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState('overview')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [username, setUsername] = useState('')


    useEffect(() => {
        const name = localStorage.getItem('username') || ''
        setUsername(name || 'PFT User')
    }, [])


    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        navigate('/login')
    }


    const renderContent = () => {
        switch (selected) {
            case 'overview':
                return <Overview />
            case 'transactions':
                return <Transactions />
            case 'budgets':
                return <Budgets />
            case 'settings':
                return <Settings />
            default:
                return <Overview />
        }
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Sidebar for md+ screens */}
                <aside className="hidden md:block md:w-64 border-r border-gray-200 bg-white">
                    <Sidebar selected={selected} onSelect={setSelected} />
                </aside>


                {/* Mobile Sidebar overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
                        <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg">
                            <Sidebar
                                selected={selected}
                                onSelect={(k) => {
                                    setSelected(k)
                                    setSidebarOpen(false)
                                }}
                            />
                        </div>
                    </div>
                )}


                {/* Main area */}
                <div className="flex-1 min-h-screen flex flex-col">
                    <TopBar
                        username={username}
                        onLogout={handleLogout}
                        onOpenSidebar={() => setSidebarOpen(true)}
                    />


                    <main className="p-6 w-full">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    )
}