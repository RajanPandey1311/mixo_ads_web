import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Layout/Header';
import { Dashboard } from './pages/Dashboard';
import { CampaignDetail } from './pages/CampaignDetail';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
                <Header />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/campaign/:id" element={<CampaignDetail />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
