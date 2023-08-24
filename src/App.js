import './App.css';
import './style.css';
import MainMap from './components/MainMap';
import ControlPanel from './components/ControlPanel.js';

function App() {
  return (
    <div className="App box">
      <header>
        <ControlPanel />
      </header>
      <section>
        <MainMap/>
      </section>
    </div>
  );
}

export default App;
