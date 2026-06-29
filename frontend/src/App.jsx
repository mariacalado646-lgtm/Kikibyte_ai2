import { useLocation } from 'react-router'
import { AuthProvider } from './context/AuthContext'
import { Navbar } from './components/Navbar'
import { AppRoutes } from './routes/AppRoutes'

export default function App() {
  return (
    <AuthProvider>
      <Navbar />
      <main className="kb-main-content">
        <AppRoutes />
      </main>
    </AuthProvider>
  )
}
