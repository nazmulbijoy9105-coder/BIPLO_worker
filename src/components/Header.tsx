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
    { value: "student", label: "Student Portal", icon: <GraduationCap className="w-4 h-4 text-blue-600" /> },
    { value: "trainer", label: "Trainer Portal", icon: <User className="w-4 h-4 text-emerald-600" /> },
    { value: "employer", label: "Employer Portal", icon: <Briefcase className="w-4 h-4 text-indigo-600" /> },
    { value: "partner", label: "Licensed Recruiter", icon: <Landmark className="w-4 h-4 text-amber-600" /> },
    { value: "admin", label: "Admin Console", icon: <Shield className="w-4 h-4 text-rose-600" /> },
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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-xs" id="biplob-main-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("home")}>
            <div className="flex items-center justify-center w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-700 text-white rounded-xl shadow-md shadow-blue-500/20">
              <Globe className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-gray-900 bg-clip-text">
                BIPLOB
              </span>
              <p className="text-[10px] font-semibold text-gray-400 tracking-wider uppercase -mt-1">
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
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  activeTab === item.id
                    ? "text-blue-600 bg-blue-50/70 font-semibold"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
                className="flex items-center space-x-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>{getRoleLabel(currentRole)}</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-1 divide-y divide-gray-50">
                  <div className="px-4 py-2">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider block">
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
                        className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 transition-colors ${
                          currentRole === role.value
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
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
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                isLoggedIn
                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10"
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
              className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1.5 rounded-lg"
            >
              Role: {currentRole.toUpperCase()}
            </button>
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 p-2 hover:bg-gray-50 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-3 shadow-lg" id="mobile-navigation-drawer">
          <div className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block px-4">
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
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left flex items-center space-x-2 ${
                    currentRole === role.value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-100 bg-gray-50/50 text-gray-700"
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg text-sm shadow-xs"
            >
              {isLoggedIn ? "Logout Profile" : "Register / Sign In"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
