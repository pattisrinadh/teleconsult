import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Stethoscope, 
  FileText, 
  BarChart2, 
  Bell, 
  Menu, 
  X,
  Search,
  LogOut
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Patients', icon: Users, path: '/patients' },
    { name: 'Appointments', icon: Calendar, path: '/appointments' },
    { name: 'Teleconsult', icon: Stethoscope, path: '/room/demo' }, // Demo link
    { name: 'Prescriptions', icon: FileText, path: '/prescriptions' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
  ];

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Dashboard';
    if (location.pathname.startsWith('/room')) return 'Consultation Room';
    return location.pathname.split('/')[1].charAt(0).toUpperCase() + location.pathname.split('/')[1].slice(1);
  };

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-primary-600 text-white p-2 rounded-xl">
          <Stethoscope size={24} />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
          TeleConsult
        </span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => setIsMobileMenuOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30' 
                  : 'text-slate-600 hover:bg-white/50 hover:text-primary-600'
              }`
            }
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/20">
        <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
          <img src="https://picsum.photos/40/40" alt="Dr Profile" className="w-10 h-10 rounded-full border-2 border-white" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 truncate">Dr. Asha Rao</p>
            <p className="text-xs text-slate-500 truncate">General Medicine</p>
          </div>
          <button className="text-slate-400 hover:text-red-500">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed inset-y-0 left-0 glass-panel z-20 border-r-0 border-r-white/20">
        <NavContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      
      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-xl z-40 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 px-8 flex items-center justify-between glass-panel sticky top-0 z-10 border-b-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 hover:bg-white/50 rounded-lg text-slate-600"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/50 rounded-full border border-white/30 focus-within:ring-2 ring-primary-400 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-slate-400"
              />
            </div>
            
            <button className="relative p-2 hover:bg-white/50 rounded-full transition-colors text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;