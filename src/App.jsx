import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import WifiList from './pages/WifiList';
import AIAssistant from './pages/AIAssistant';
import ServiceGuide from './pages/ServiceGuide';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/wifi-list" element={<WifiList />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/guide" element={<ServiceGuide />} />
      </Routes>
    </BrowserRouter>
  );
}
