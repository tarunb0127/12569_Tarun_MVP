import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import icon from "../assets/icon.png";
import logodarkbarred from "../assets/validate_2.png";
import "../styles/layout_styles/Sidebar.css";

const Sidebar = ({
  allowedRoles = [],
  currentRole,
  isOpen,
  onToggle,
  onClose,
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarExpanded(true);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const allMenuItems = {
    Admin: [
      { icon: "bi-speedometer2",        label: "Dashboard",             path: "/admin/dashboard" },
      { icon: "bi-people",              label: "User Management",       path: "/admin/users" },
      { icon: "bi-shield-lock",         label: "Role Management",       path: "/admin/roles" },
      { icon: "bi-building",            label: "Departments",           path: "/admin/departments" },
      { icon: "bi-clipboard-check",     label: "Change Requests",       path: "/admin/change-requests" },
      { icon: "bi-person-bounding-box", label: "Photo Validator",       path: "/profile-photo-validator" },
    ],
    HR: [
      { icon: "bi-speedometer2",        label: "Dashboard",             path: "/hr/dashboard" },
      { icon: "bi-person-bounding-box", label: "Photo Validator",       path: "/profile-photo-validator" },
    ],
    Leadership: [
      { icon: "bi-speedometer2",        label: "Dashboard",             path: "/leadership/dashboard" },
      { icon: "bi-person-bounding-box", label: "Photo Validator",       path: "/profile-photo-validator" },
    ],
    "Department Head": [
      { icon: "bi-speedometer2",        label: "Dashboard",             path: "/department-head/dashboard" },
      { icon: "bi-person-bounding-box", label: "Photo Validator",       path: "/profile-photo-validator" },
    ],
    Manager: [
      { icon: "bi-speedometer2",        label: "Dashboard",             path: "/manager/dashboard" },
      { icon: "bi-person-bounding-box", label: "Photo Validator",       path: "/profile-photo-validator" },
    ],
    Employee: [
      { icon: "bi-speedometer2",        label: "Dashboard",             path: "/employee/dashboard" },
      { icon: "bi-person-bounding-box", label: "Photo Validator",       path: "/profile-photo-validator" },
    ],
  };

  const getMenuItems = () => {
    if (allowedRoles.length === 0) return allMenuItems[currentRole] || [];
    if (allowedRoles.includes(currentRole)) return allMenuItems[currentRole] || [];
    return allMenuItems[allowedRoles[0]] || [];
  };

  const menuItems = getMenuItems();
  const isActive = (path) => location.pathname === path;

  const toggleSidebar = () => {
    if (isMobile) onToggle();
    else setSidebarExpanded(!sidebarExpanded);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    if (isMobile && onClose) onClose();
  };

  const sidebarClass = isMobile
    ? `sbd-sidebar sbd-mobile ${isOpen ? "sbd-open" : ""}`
    : `sbd-sidebar ${sidebarExpanded ? "sbd-expanded" : "sbd-collapsed"}`;

  return (
    <>
      <aside className={sidebarClass}>

        {/* Logo */}
        <div className="sbd-logo-section">
          <img
            src={isMobile || sidebarExpanded ? logodarkbarred : icon}
            alt="Logo"
            className="sbd-logo"
          />
        </div>

        {/* Collapse toggle — desktop only */}
        {!isMobile && (
          <button
            className="sbd-toggle-btn"
            onClick={toggleSidebar}
            aria-label={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
            title={sidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`bi ${sidebarExpanded ? "bi-chevron-left" : "bi-chevron-right"}`}></i>
          </button>
        )}

        {/* Nav Menu */}
        <nav className="sbd-nav">
          <ul className="sbd-menu-list">
            {menuItems.map((item, index) => {
              const active = isActive(item.path);
              return (
                <li key={index} className="sbd-menu-item">
                  <button
                    onClick={() => handleMenuClick(item.path)}
                    className={`sbd-menu-btn ${active ? "sbd-active" : ""}`}
                    title={!sidebarExpanded && !isMobile ? item.label : ""}
                  >
                    {active && <div className="sbd-active-indicator" />}
                    <i className={`bi ${item.icon} sbd-menu-icon`}></i>
                    {(sidebarExpanded || isMobile) && (
                      <span className="sbd-menu-label">{item.label}</span>
                    )}
                  </button>

                  {/* Tooltip — collapsed desktop only */}
                  {!sidebarExpanded && !isMobile && (
                    <div className="sbd-tooltip">{item.label}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile backdrop */}
      {isMobile && isOpen && (
        <div className="sbd-mobile-backdrop" onClick={onClose} />
      )}
    </>
  );
};

export default Sidebar;
