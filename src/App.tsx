import { Header, Footer } from './components/Layout';
import { Hero } from './components/Hero';
import { TripOverview } from './components/TripOverview';
import { BookingChecklist } from './components/BookingChecklist';
import { ItinerarySection } from './components/ItinerarySection';
import { PokemonSection } from './components/PokemonSection';
import { FoodMap } from './components/FoodMap';
import { TipsSection } from './components/TipsSection';
import { BoardProvider } from './context/BoardContext';
import { getItinerary } from './data/itinerary.en';

function App() {
  const itinerary = getItinerary('en');

  return (
    <BoardProvider days={itinerary.days}>
      <div className="min-h-screen">
        <Header />
        <main>
          <Hero meta={itinerary.meta} />
          <TripOverview meta={itinerary.meta} seasonNotes={itinerary.seasonNotes} />
          <BookingChecklist items={itinerary.bookingChecklist} />
          <ItinerarySection days={itinerary.days} />
          <PokemonSection
            strategy={itinerary.pokemonStrategy}
            centers={itinerary.pokemonCenters}
            shops={itinerary.tcgShops}
          />
          <FoodMap days={itinerary.days} />
          <TipsSection backupPlans={itinerary.backupPlans} extras={itinerary.recommendedExtras} />
        </main>
        <Footer />
      </div>
    </BoardProvider>
  );
}

export default App;
