import "../../styles/auth/EmployeeDashboard.css";

const EmployeeDashboard = () => {
  return (
    <div className="hr-dashboard-container">
      <div className="dashboard-cards-container">
        <div className="dashboard-row">
          <div className="dashboard-card card-medium">
            <div className="card-header-dark">
              <div className="card-header-content">
                <h3>Employee Dashboard</h3>
              </div>
            </div>

            <div className="card-body emp-hello-body">
              Hello Employee 👋
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;