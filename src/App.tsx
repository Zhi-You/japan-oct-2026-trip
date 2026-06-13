import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BoardProvider } from './context/BoardContext';
import { getItinerary } from './data/itinerary.en';
import { HomePage } from './pages/HomePage';
import { DayFocusPage } from './pages/DayFocusPage';

function App() {
  const itinerary = getItinerary('en');

  return (
    <BoardProvider days={itinerary.days}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage itinerary={itinerary} />} />
          <Route path="/day/:dayId" element={<DayFocusPage days={itinerary.days} />} />
          <Route path="/day" element={<DayFocusPage days={itinerary.days} />} />
        </Routes>
      </BrowserRouter>
    </BoardProvider>
  );
}

export default App;
