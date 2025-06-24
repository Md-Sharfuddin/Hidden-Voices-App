'use client';

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from './ui/button';

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white border-b border-white/10 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">

                {/* Left: Dashboard + View Profile */}
                <div className="flex items-center gap-4">
                    {session && (
                        <>
                            <Link href="/dashboard">
                                <Button variant="link" className="text-white px-2">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href={`/user/${user.username}`}>
                                <Button variant="link" className="text-white px-2">
                                    View Profile
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Center: Branding */}
                <Link href="/" className="text-lg md:text-xl font-bold tracking-wide text-center absolute left-1/2 transform -translate-x-1/2">
                    Hidden Voices - Honest Feedback
                </Link>

                {/* Right: Sign Out or Login/Signup */}
                <div className="flex items-center gap-4">
                    {session ? (
                        <Button
                            onClick={() => signOut()}
                            className="text-white border border-white hover:bg-white hover:text-black"
                            variant="ghost"
                        >
                            Sign Out
                        </Button>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button
                                    className="text-white border border-white hover:bg-white hover:text-black"
                                    variant="ghost"
                                >
                                    Login
                                </Button>
                            </Link>
                            <Link href="/sign-up">
                                <Button
                                    className="text-white border border-white hover:bg-white hover:text-black"
                                    variant="ghost"
                                >
                                    Sign up
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
