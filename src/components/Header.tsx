import React from "react";
import { Globe, Shield, User, Briefcase, GraduationCap, ChevronDown, Menu, X, Landmark } from "lucide-react";
import { UserRole } from "../types";

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onLoginToggle: () => void;
}

export default function Header({
  currentRole,
  onRoleChange,
  activeTab,
  setActiveTab,
  isLoggedIn,
  onLoginToggle
}: HeaderProps) {
  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const rolesList: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    { value: "student", label: "Student Portal", icon: <GraduationCap className="w-4 h-4 text-[#B8860B]" /> },
    { value: "trainer", label: "Trainer Portal", icon: <User className="w-4 h-4 text-[#B8860B]" /> },
    { value: "employer", label: "Employer Portal", icon: <Briefcase className="w-4 h-4 text-[#B8860B]" /> },
    { value: "partner", label: "Licensed Recruiter", icon: <Landmark className="w-4 h-4 text-[#B8860B]" /> },
    { value: "admin", label: "Admin Console", icon: <Shield className="w-4 h-4 text-[#B8860B]" /> },
  ];

  const getRoleLabel = (role: UserRole) => {
    return rolesList.find((r) => r.value === role)?.label || "Select Portal";
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "assessment", label: "AI Assessment" },
    { id: "resume", label: "AI Resume Builder" },
    { id: "courses", label: "Language & Trade Courses" },
    { id: "jobs", label: "Job Board" },
    { id: "verify", label: "Verify Certificate" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-black" id="biplob-main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="flex items-center justify-center w-11 h-11 bg-black text-[#B8860B] border border-black shadow-[2px_2px_0px_0px_rgba(184,134,11,1)]">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-black">
                BIPLOB
              </span>
              <p className="text-[9px] font-bold text-[#B8860B] tracking-wider uppercase -mt-1">
                Skills Beyond Borders
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-150 rounded-none border ${
                  activeTab === item.id
                    ? "text-white bg-black border-black"
                    : "text-black hover:text-[#B8860B] hover:bg-[#FAF9F6] border-transparent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Action Zone (Role switcher + Auth state) */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Quick Portal Switcher */}
            <div className="relative">
              <button
                id="portal-switcher-btn"
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 border-2 border-black text-xs font-bold uppercase tracking-wider hover:bg-[#FAF9F6] transition-colors text-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <span className="w-2 h-2 rounded-none bg-[#B8860B] animate-pulse"></span>
                <span>{getRoleLabel(currentRole)}</span>
                <ChevronDown className="w-4 h-4 text-black" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 py-1 divide-y divide-black/10 rounded-none">
                  <div className="px-4 py-2 bg-[#FAF9F6]">
                    <span className="text-[9px] text-black/50 font-bold uppercase tracking-widest block">
                      Explore Workspace
                    </span>
                  </div>
                  <div className="py-1">
                    {rolesList.map((role) => (
                      <button
                        key={role.value}
                        id={`role-select-${role.value}`}
                        onClick={() => {
                          onRoleChange(role.value);
                          setRoleMenuOpen(false);
                          if (role.value === "student") setActiveTab("student-dash");
                          if (role.value === "trainer") setActiveTab("trainer-dash");
                          if (role.value === "employer") setActiveTab("employer-dash");
                          if (role.value === "partner") setActiveTab("partner-dash");
                          if (role.value === "admin") setActiveTab("admin-dash");
                        }}
                        className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-wide flex items-center space-x-3 transition-colors rounded-none ${
                          currentRole === role.value
                            ? "bg-black text-white"
                            : "text-black hover:bg-[#FAF9F6] hover:text-[#B8860B]"
                        }`}
                      >
                        {role.icon}
                        <span>{role.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Auth Button */}
            <button
              id="header-auth-btn"
              onClick={onLoginToggle}
              className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-2 border-black rounded-none transition-all ${
                isLoggedIn
                  ? "bg-[#FAF9F6] text-black hover:bg-black hover:text-white"
                  : "bg-[#B8860B] hover:bg-black text-white hover:text-[#B8860B] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {isLoggedIn ? "Logout Profile" : "Register / Sign In"}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-3">
            <button
              id="mobile-portal-switcher-btn"
              onClick={() => {
                onRoleChange(currentRole === "student" ? "employer" : "student");
                if (currentRole === "student") setActiveTab("employer-dash");
                else setActiveTab("student-dash");
              }}
              className="text-[9px] font-bold uppercase tracking-wider text-[#B8860B] bg-black px-2.5 py-1.5 border border-black rounded-none"
            >
              Role: {currentRole.toUpperCase()}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-black p-2 hover:bg-[#FAF9F6] border-2 border-black rounded-none"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t-2 border-black px-4 pt-2 pb-6 space-y-4 shadow-lg" id="mobile-navigation-drawer">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold uppercase tracking-widest border-b border-black/5 ${
                  activeTab === item.id
                    ? "text-[#B8860B] bg-black/5 border-l-4 border-l-[#B8860B]"
                    : "text-black hover:bg-[#FAF9F6]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-black/10 pt-4 space-y-3">
            <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest block px-4">
              Switch Roles / Portals
            </span>
            <div className="grid grid-cols-2 gap-2 px-2">
              {rolesList.map((role) => (
                <button
                  key={role.value}
                  id={`mobile-role-select-${role.value}`}
                  onClick={() => {
                    onRoleChange(role.value);
                    setMobileMenuOpen(false);
                    if (role.value === "student") setActiveTab("student-dash");
                    if (role.value === "trainer") setActiveTab("trainer-dash");
                    if (role.value === "employer") setActiveTab("employer-dash");
                    if (role.value === "partner") setActiveTab("partner-dash");
                    if (role.value === "admin") setActiveTab("admin-dash");
                  }}
                  className={`px-3 py-2 text-[10px] font-bold uppercase border-2 border-black text-left flex items-center space-x-2 rounded-none transition-all ${
                    currentRole === role.value
                      ? "bg-black text-[#B8860B] border-black"
                      : "bg-white text-black border-black/15"
                  }`}
                >
                  {role.icon}
                  <span>{role.label.split(" ")[0]}</span>
                </button>
              ))}
            </div>

            <button
              id="mobile-auth-btn"
              onClick={() => {
                onLoginToggle();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-[#B8860B] hover:bg-black text-white hover:text-[#B8860B] font-bold uppercase text-xs tracking-wider py-3 border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {isLoggedIn ? "Logout Profile" : "Register / Sign In"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
