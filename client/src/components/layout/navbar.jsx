import { ActivityIcon } from 'lucide-react'
import React, { Activity } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/button'

const Navbar = () => {
    return (
        <header className="relative z-50 border-b border-border/40 bg-card/30 backdrop-blur-md sticky top-0">
            <div className="container  max-w-7xl  mx-auto px-4 py-4 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                       <img src="/logo.png" alt="Logo" className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-lg">Red-Ease RateLimiter</span>
                </div>

                {/* Nav Links */}
                <nav className="hidden md:flex items-center font-semibold gap-8">
                    <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Home
                    </Link>
                    <Link to="/simulator" className="text-sm text-muted-foreground hover:text-foreground transition">
                        Simulator
                    </Link>
                    <Link to="/docs" className="text-sm text-muted-foreground hover:text-foreground transition">
                        View Docs
                    </Link>
                    <Button asChild size="sm">
                        <Link to="/dashboard">Dashboard</Link>
                    </Button>
                </nav>

                {/* Mobile */}
                <div className="md:hidden">
                    <Button asChild size="sm">
                        <Link to="/dashboard">Launch</Link>
                    </Button>
                </div>

            </div>
        </header>
    )
}

export default Navbar
