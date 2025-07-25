import { BrowserRouter, Route, Routes } from 'react-router';
import MassTrigger from './pages/massTrigger';

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/mass' element={<MassTrigger />} />
            </Routes>
        </BrowserRouter>
    );
}
