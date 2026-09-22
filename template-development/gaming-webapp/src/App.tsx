import React from 'react';
import { BrowserRouter as Router, Switch, Route }  from 'react-router-dom';
import './App.css';
import Home from './components/Home/Home'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/incoming-events' component={Home}/>
        <Route path='/ongoing-events' component={Home}/>
        <Route path='/games' component={Home}/>
        <Route path='/contact' component={Home}/>
        </Switch>
      </Router>
      <Footer />
    </div>
  );
}

export default App;
