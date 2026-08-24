import React, { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'works', label: 'My Works', href: '#works' },
  { id: 'photography', label: 'Photography', href: '#photography' },
  { id: 'coding', label: 'Coding', href: '#coding' },
];

export const Navbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('works');

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-black/80 backdrop-blur-lg hairline-b">
      <nav 
        aria-label="Main Navigation" 
        className="max-w-[1400px] mx-auto px-6 md:px-16 h-16 md:h-20 flex items-center justify-center"
      >
        {/* Nav Links */}
        <ul className="flex items-center gap-6 sm:gap-10 md:gap-14">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="relative">
                <a
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`font-mono-code text-[11px] md:text-xs tracking-[0.22em] uppercase transition-colors duration-200 block py-1 ${
                    isActive ? 'text-white font-medium' : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {item.label}
                </a>

                {/* Animated Hairline Underline */}
                <span
                  className={`absolute bottom-0 left-0 h-[1px] bg-white transition-all duration-300 ease-out ${
                    isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-full'
                  }`}
                />
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
};
