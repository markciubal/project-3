import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import Login from './Login';
import ControlPanel from './src/components/ControlPanel';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
                {/* possibly change '/control-panel' to just '/home' or '/'*/}
                <Route path="/control-panel" element={ <PrivateRoute><ControlPanel /></PrivateRoute>} />
            </Routes>
        </Router>
    );
};

// A wrapper component for protecting routes
const PrivateRoute = ({ children }) => {
    if (Auth.isAuthenticated()) {
      return children;
    } else {
      return <Navigate to="/login" />;
    }
};


export default App;