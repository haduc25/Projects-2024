import Navbar from './components/Navbar/Navbar';
import Sidebar from './components/Sidebar/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Orders from './pages/Orders/Orders';

const App = () => {
    const url = 'http://localhost:5200/';

    return (
        <div>
            <Navbar />
            <hr />
            <div className="app-content">
                <Sidebar />
                <Routes>
                    {/* <Route path="add" element={<Add url={url} />} />
                    <Route path="list" element={<List url={url} />} /> */}
                    <Route path="orders" element={<Orders url={url} />} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
