import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { Toaster } from 'react-hot-toast';
function App() {
  return <div>
    <BrowserRouter>
      <Routes>
        <Route path="/messenger/login" element={<Login />} />
        <Route path="/messenger/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" reverseOrder={false} />
  </div>;
}

export default App;
