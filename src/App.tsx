import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';
import DocumentAdd from './pages/documents/DocumentAdd';
import DocumentDetail from './pages/documents/DocumentDetail';
import DocumentEdit from './pages/documents/DocumentEdit';
import DocumentList from './pages/documents/DocumentList';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import PublicLayout from './pages/Public';
import { routeMap } from './routes/routeMap';

function App() {
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/forgot-password' element={<ForgotPassword />} />
			<Route element={<ProtectedRoute />}>
				<Route path='/' element={<PublicLayout />}>
					{/* Route mặc định điều hướng vào trang đầu tiên trong routeMap. */}
					<Route index element={<Navigate to={routeMap[0].path} replace />} />
					{routeMap.map((route) => (
						<Route key={route.path} path={route.path.replace(/^\//, '')} element={route.element} />
					))}
					<Route path="document" element={<Outlet />}>
						<Route index element={<DocumentList />} />
						<Route path="add" element={<DocumentAdd />} />
						<Route path="detail/:id" element={<DocumentDetail />} />
						<Route path="edit/:id" element={<DocumentEdit />} />
					</Route>
				</Route>
			</Route>
			<Route path='*' element={<Navigate to='/' replace />} />
		</Routes>
	);
}

export default App;
