import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
	return (
		<div className="App">
			<Router>
				<Switch>
					<Route path={'/'} component={Login}  />
					<Route path={'/Dashboard'} component={Dashboard}  />
				</Switch>
			</Router>
		</div>
	);
};

export default App;