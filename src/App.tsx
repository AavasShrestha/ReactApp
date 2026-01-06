import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import LoginPage from './components/LoginPage';
import Dashboard from './DashBoard/Dashboard';
import UsersPage from './components/UsersPage';
import ErrorBoundary from './components/ErrorBoundary';
import UserPage from './components/Users/UserPage';
import ClientPage from './components/Clients/ClientPage';
import DatabasePage from './components/DataBase/DatasbasePage';
import LogoPage from './components/Logo/LogoPage';


function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes with Layout */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/clients"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ClientPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <UserPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/databases"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <DatabasePage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/logos"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <LogoPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />


              {/* Default redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;