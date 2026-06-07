import type { DayPlan } from '../types/itinerary';
import { useBoard } from '../context/BoardContext';
import { CardNotesPanel } from './board/CardNotesPanel';
import { TimelineCardContent } from './board/TimelineCardContent';
import { DayMapPanel } from './map/DayMapPanel';
import { DaySectionFooter, DaySectionHeader } from './map/DaySectionHeader';
import { useDayMapOpen } from './map/useDayMapOpen';

interface DayTimelineProps {
  days: DayPlan[];
}

export function DayTimeline({ days }: DayTimelineProps) {
  const { getDayCards } = useBoard();
  const { isOpen, toggle } = useDayMapOpen();

  const activeDays = days.filter((d) => {
    const cards = getDayCards(d.id);
    return cards.length > 0 || d.transport.length > 0 || d.dayTips.length > 0;
  });

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 hidden h-full w-0.5 bg-gradient-to-b from-vermillion via-indigo to-gold md:left-8 md:block" />

      <div className="space-y-12">
        {activeDays.map((day) => {
          const cards = getDayCards(day.id);
          const mapOpen = isOpen(day.id);

          return (
            <div key={day.id} className="relative md:pl-20">
              <div className="absolute left-2.5 top-6 hidden h-4 w-4 rounded-full border-4 border-white bg-vermillion shadow md:left-6.5 md:block" />

              <div className="rounded-2xl border border-washi-dark bg-washi/50 p-6 md:p-8">
                <DaySectionHeader
                  day={day}
                  mapOpen={mapOpen}
                  onToggleMap={() => toggle(day.id)}
                />

                {mapOpen ? (
                  <DayMapPanel day={day} cards={cards} />
                ) : (
                  <div className="mt-6 space-y-4">
                    {cards.map((card, i) => (
                      <div key={card.id} className="relative flex gap-2 md:gap-3">
                        <div className="min-w-0 flex-1">
                          <TimelineCardContent card={card} index={i} mode="view" />
                        </div>
                        <div className="relative shrink-0 pt-2">
                          <CardNotesPanel dayId={day.id} cardId={card.id} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <DaySectionFooter day={day} showPokemon={!mapOpen} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
