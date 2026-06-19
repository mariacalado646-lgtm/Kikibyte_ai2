import { Route } from 'react-router'
import { LoginChoice }   from '../pages/LoginChoice'
import { LoginExisting } from '../pages/LoginExisting'
import { LoginNew }      from '../pages/LoginNew'
import { AdminLogin }    from '../pages/AdminLogin'

export const authRoutes = [
    <Route key="login"           path="/login"           element={<LoginChoice />} />,
<Route key="login-existing"  path="/login/existing"  element={<LoginExisting />} />,
<Route key="login-new"       path="/login/new"       element={<LoginNew />} />,
<Route key="admin-login"     path="/admin/login"     element={<AdminLogin />} />,
]
