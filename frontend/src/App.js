import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SubmitAppeal from './components/SubmitAppeal';
import AppealsList from './components/AppealsList';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/submit-appeal" component={SubmitAppeal} />
          <Route path="/appeals-list" component={AppealsList} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;