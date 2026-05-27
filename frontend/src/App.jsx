import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import "./App.css";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;