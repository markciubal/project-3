import './App.css';
import './style.css';
import MainMap from './components/MainMap';
import ControlPanel from './components/ControlPanel.js';

import Login from './pages/Login';
// import Signup from './pages/Signup';

function App() {
  return (
    <div className="App box">
      <header>
        <ControlPanel />
      </header>
      <li>
          <Link to="/login">
              Login
          </Link>
      </li>
      <section>
        <MainMap/>
      </section>
    </div>
  );
}

export default App;
