import { Template } from './components/MainComponents';
import { useAppSelector } from './redux/hooks/useAppSelector';
import { MainRoutes } from './routes/MainRoutes';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.css';

function App() {
	const user = useAppSelector(state => state.user);

	return (
		<Template>
			<Header />
			<MainRoutes />
			<Footer />
		</Template>
	);
}

export default App;
