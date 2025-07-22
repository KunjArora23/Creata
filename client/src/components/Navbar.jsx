import { Link, useNavigate } from "react-router-dom";
import useAuth from "../contexts/useAuth";
import { useFriend } from "../contexts/FriendContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageSquare, 
  Bell,
  User,
  LayoutDashboard,
  ClipboardList,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

const Navbar = () => {
    const { user, loading, logout } = useAuth();
    const { pendingRequests } = useFriend();
    const totalUnreadMessages=4;
    
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const NavLinks = () => (
        <>
            <Link 
                to="/dashboard" 
                onClick={closeMobileMenu}
                className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors flex items-center gap-2"
            >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
            </Link>
            
            <Link 
                to="/task-board" 
                onClick={closeMobileMenu}
                className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors flex items-center gap-2"
            >
                <ClipboardList className="w-4 h-4" />
                <span className="hidden sm:inline">Tasks</span>
            </Link>
            
            <Link 
                to="/friends" 
                onClick={closeMobileMenu}
                className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors flex items-center gap-2 relative"
            >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Friends</span>
                {pendingRequests.length > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-[#F59E0B] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {pendingRequests.length}
                    </motion.span>
                )}
            </Link>
            
            <Link 
                to="/chat" 
                onClick={closeMobileMenu}
                className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors flex items-center gap-2 relative"
            >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Chat</span>
                {totalUnreadMessages > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 bg-[#EF4444] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                        {totalUnreadMessages > 99 ? '99+' : totalUnreadMessages}
                    </motion.span>
                )}
            </Link>
            
            <Link 
                to="/profile" 
                onClick={closeMobileMenu}
                className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors flex items-center gap-2"
            >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
            </Link>
            
            <button 
                onClick={handleLogout}
                className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#EF4444] hover:bg-[#DC2626] transition-colors cursor-pointer flex items-center gap-2"
            >
                <span className="hidden sm:inline">Logout</span>
            </button>
        </>
    );

    return (
        <nav className="w-full px-4 py-3 flex items-center justify-between bg-[#0D1117] border-b border-[#30363D] font-inter sticky top-0 z-50">
            <Link to="/" className="text-2xl font-grotesk font-extrabold text-[#F2F3F5] tracking-tight">
                CredMate
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-4">
                {!loading && !user && (
                    <>
                        <Link to="/register" className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors">Sign Up</Link>
                        <Link to="/login" className="px-5 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#6366F1] hover:bg-[#4F46E5] transition-colors">Login</Link>
                    </>
                )}
                {!loading && user && <NavLinks />}
            </div>

            {/* Mobile Menu Button */}
            {!loading && user && (
                <button
                    onClick={toggleMobileMenu}
                    className="lg:hidden p-2 rounded-lg text-[#F2F3F5] hover:bg-[#21262C] transition-colors"
                >
                    {isMobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            )}

            {/* Mobile Navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-[#0D1117] border-b border-[#30363D] lg:hidden"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <NavLinks />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Auth Buttons */}
            {!loading && !user && (
                <div className="lg:hidden flex items-center gap-2">
                    <Link to="/register" className="px-3 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#21262C] border border-[#30363D] hover:bg-[#161B22] transition-colors text-sm">Sign Up</Link>
                    <Link to="/login" className="px-3 py-2 rounded-lg font-semibold text-[#F2F3F5] bg-[#6366F1] hover:bg-[#4F46E5] transition-colors text-sm">Login</Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar; 