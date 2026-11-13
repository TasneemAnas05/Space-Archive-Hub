import GameCard from '../components/GameCard'
import './Games.css'

const GAMES = [
  {
    title: 'Apollo 11',
    subtitle: 'LUNAR LANDER',
    description:
      'Pilot the Eagle lunar module from orbit to a safe touchdown on the Sea of Tranquility. Manage your fuel, control descent rate, and land before history watches.',
    route: '/play/apollo11',
    icon: '🌕',
    color: '#c8d8e8',
    difficulty: 2,
    year: 'July 1969',
  },
  {
    title: 'Apollo 15',
    subtitle: 'LUNAR ROVER',
    description:
      'Take the wheel of the first Lunar Roving Vehicle. Navigate the rugged Hadley–Apennine terrain, collect rock samples, and return to base before your battery runs out.',
    route: '/play/apollo15',
    icon: '🚗',
    color: '#00d4ff',
    difficulty: 1,
    year: 'July 1971',
  },
  {
    title: 'Artemis',
    subtitle: 'RETURN TO THE MOON',
    description:
      'Guide the Orion spacecraft through a series of orbital maneuvers to dock with the Lunar Gateway station. Precision burns and timing are everything.',
    route: '/play/artemis',
    icon: '🛸',
    color: '#7b2fff',
    difficulty: 3,
    year: '2025+',
  },
  {
    title: 'Mars',
    subtitle: 'RED PLANET ROVER',
    description:
      'Command the Perseverance rover across the Jezero Crater floor. Avoid hazards, deploy the Ingenuity helicopter, and collect the samples that will define Mars science.',
    route: '/play/mars',
    icon: '🔴',
    color: '#e8603c',
    difficulty: 2,
    year: '2030s',
  },
]

export default function Games() {
  return (
    <div className="games-page">
      <div className="games-header">
        <h1>MISSION SELECT</h1>
        <p>Choose your mission. Each game is a unique interactive experience.</p>
      </div>
      <div className="games-grid">
        {GAMES.map(g => (
          <GameCard key={g.title} {...g} />
        ))}
      </div>
    </div>
  )
}
