import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Users from "./pages/Users";
import Main from "./pages/Main";
import Connections from "./pages/Connections";
import Metamodels from "./pages/Metamodels";
import Tables from "./pages/Tables";
import TableSetup from "./pages/TableSetup";
import Tasks from "./pages/Tasks";
import "./css/App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/connections" element={<Connections />} />
        <Route path="/metamodels" element={<Metamodels />} />
        <Route path="/tables" element={<Tables />} />
        <Route path="/tableSetup" element={<TableSetup />} />
        <Route path="/tasks" element={<Tasks />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
