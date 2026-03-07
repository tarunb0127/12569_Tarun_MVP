import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/auth/AuthContext";
import ProtectedRoute from "./components/guards/ProtectedRoute";
import PublicRoute from "./components/guards/PublicRoute";
import DashboardLayout from "./layouts/DashboardLayout";

/* Auth pages */
import Login from "./pages/auth/common/Login";
import VerifyCode from "./pages/auth/common/VerifyCode";
import ChangePassword from "./pages/auth/common/ChangePassword";
import ResetPassword from "./pages/auth/common/ResetPassword";
import VerifyResetOtp from "./pages/auth/common/VerifyResetOtp";
import VerifyFirstLogin from "./pages/auth/common/VerifyFirstLogin";
import EmployeeProfile from "./pages/auth/common/EmployeeProfile";

/* Admin master data pages (optional but still auth-related) */
import DepartmentList from "./pages/auth/admin/departments/DepartmentList";
import RoleList from "./pages/auth/admin/roles/RoleList";
import UserList from "./pages/auth/admin/users/UserList";
import ChangeRequestManagement from "./pages/auth/admin/ChangeRequestManagement";

/* Dashboards */
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import HRDashboard from "./pages/dashboards/HRDashboard";
import LeadershipDashboard from "./pages/dashboards/LeadershipDashboard";
import DepartmentHeadDashboard from "./pages/dashboards/DepartmentHeadDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import EmployeeDashboard from "./pages/dashboards/EmployeeDashboard";
import ProfileValidatorPage from "./pages/validator/ProfileValidatorPage";


const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Default → login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-code"
        element={
          <PublicRoute>
            <VerifyCode />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-reset-otp"
        element={
          <PublicRoute>
            <VerifyResetOtp />
          </PublicRoute>
        }
      />
      <Route
        path="/verify-first-login"
        element={
          <PublicRoute>
            <VerifyFirstLogin />
          </PublicRoute>
        }
      />
      <Route
        path="/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

      {/* Dashboards by role */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardLayout role="Admin">
              <AdminDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/hr/dashboard"
        element={
          <ProtectedRoute allowedRoles={["HR"]}>
            <DashboardLayout role="HR">
              <HRDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/leadership/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Leadership"]}>
            <DashboardLayout role="Leadership">
              <LeadershipDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/department-head/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Department Head"]}>
            <DashboardLayout role="Department Head">
              <DepartmentHeadDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/manager/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <DashboardLayout role="Manager">
              <ManagerDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/employee/dashboard"
        element={
          <ProtectedRoute allowedRoles={["Employee"]}>
            <DashboardLayout role="Employee">
              <EmployeeDashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Profile page for any logged-in user */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout role={user?.role}>
              <EmployeeProfile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin master-data pages (optional; remove if not needed) */}
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardLayout role="Admin">
              <DepartmentList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardLayout role="Admin">
              <UserList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardLayout role="Admin">
              <RoleList />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/change-requests/*"
        element={
          <ProtectedRoute allowedRoles={["Admin"]}>
            <DashboardLayout role="Admin">
              <ChangeRequestManagement />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

            {/* Profile photo validator – accessible after login */}
      <Route
        path="/profile-photo-validator"
        element={
          <ProtectedRoute>
            <DashboardLayout role={user?.role}>
              <ProfileValidatorPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Catch‑all → login (keep last) */}
      <Route path="*" element={<Navigate to="/login" replace />} />


      {/* Catch‑all → login (keep last) */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
