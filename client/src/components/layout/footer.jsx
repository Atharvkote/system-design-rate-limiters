import { Activity } from 'lucide-react'
import React from 'react'

const Footer = () => {
    return (
        <footer className="relative z-10 border-t border-border/40 bg-card/30 backdrop-blur-md max-w-7xl mx-auto px-4 py-12 rounded-xl">
            <div className="container mx-auto px-4">

                {/* Top section */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

                    {/* Brand */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-lg">
                                RateLimiter Simulator
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Production-grade API rate limit testing, simulation, and monitoring platform.
                        </p>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold mb-3">Product</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">

                            <li>
                                <a href="/simulator" className="hover:text-primary transition">
                                    Simulator
                                </a>
                            </li>

                            <li>
                                <a href="/dashboard" className="hover:text-primary transition">
                                    Dashboard
                                </a>
                            </li>

                            <li>
                                <a href="/docs" className="hover:text-primary transition">
                                    Documentation
                                </a>
                            </li>

                            <li>
                                <a href="/api-status" className="hover:text-primary transition">
                                    API Status
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Developers */}
                    <div>
                        <h4 className="font-semibold mb-3">Developers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">

                            <li>
                                <a href="/docs#architecture" className="hover:text-primary transition">
                                    Architecture
                                </a>
                            </li>

                            <li>
                                <a href="/docs#rate-limiting" className="hover:text-primary transition">
                                    Rate Limiting Guide
                                </a>
                            </li>

                            <li>
                                <a href="/docs#api" className="hover:text-primary transition">
                                    API Reference
                                </a>
                            </li>

                            <li>
                                <a
                                    href="https://github.com/yourusername/api-rate-limiters"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-primary transition"
                                >
                                    GitHub Repository
                                </a>
                            </li>

                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="font-semibold mb-3">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">

                            <li>
                                <a href="/about" className="hover:text-primary transition">
                                    About Project
                                </a>
                            </li>

                            <li>
                                <a href="/privacy" className="hover:text-primary transition">
                                    Privacy Policy
                                </a>
                            </li>

                            <li>
                                <a href="/terms" className="hover:text-primary transition">
                                    Terms of Service
                                </a>
                            </li>

                            <li>
                                <a href="/contact" className="hover:text-primary transition">
                                    Contact
                                </a>
                            </li>

                        </ul>
                    </div>

                </div>

                {/* Bottom section */}
                <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Atharva Kote. All rights reserved.
                    </p>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">

                        <a href="/docs" className="hover:text-primary transition">
                            Docs
                        </a>

                        <a href="/simulator" className="hover:text-primary transition">
                            Simulator
                        </a>

                        <a
                            href="https://github.com/yourusername/api-rate-limiters"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-primary transition"
                        >
                            GitHub
                        </a>

                        <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded">
                            System Operational
                        </span>

                    </div>

                </div>

            </div>
        </footer>
    )
}

export default Footer
