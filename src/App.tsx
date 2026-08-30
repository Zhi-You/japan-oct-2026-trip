import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BoardProvider } from './context/BoardContext';
import { PrefsProvider } from './context/PrefsContext';
import { getItinerary } from './data/itinerary';
import { HomePage } from './pages/HomePage';
import { DayFocusPage } from './pages/DayFocusPage';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

function App() {
  const { i18n } = useTranslation();
  const itinerary = getItinerary(i18n.language);

  return (
    <PrefsProvider>
      <BoardProvider days={itinerary.days}>
        <BrowserRouter basename={routerBasename}>
          <Routes>
            <Route path="/" element={<HomePage itinerary={itinerary} />} />
            <Route path="/day/:dayId" element={<DayFocusPage days={itinerary.days} />} />
            <Route path="/day" element={<DayFocusPage days={itinerary.days} />} />
          </Routes>
        </BrowserRouter>
      </BoardProvider>
    </PrefsProvider>
  );
}

export default App;
