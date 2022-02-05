import './App.css';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
	return (
		<div className="App">
			<header className="App-header">
				Fetch and manipulate JSON data from a fictional Supermetrics Social Network REST API.
			</header>
			<Dashboard />
		</div>
	);
}

export default App;
