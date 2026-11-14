import { useNavigate } from 'react-router-dom'
import './Profile.css'

const equipment = [
  { icon: '🚗', name: 'Lunar Rover',    status: 'PREVIEW', locked: false },
  { icon: '📡', name: 'Seismometer',    status: 'PREVIEW', locked: false },
  { icon: '🧪', name: 'Sample kit',     status: 'PREVIEW', locked: false },
  { icon: '📓', name: 'Field notes',    status: 'PREVIEW', locked: false },
  { icon: '🔒', name: 'Mission patch',  status: 'LOCKED',  locked: true  },
  { icon: '🔒', name: 'Next discovery', status: 'LOCKED',  locked: true  },
]

export default function Profile() {
  const navigate = useNavigate()

  return (
    <div className="profile-page">
      <div className="profile-bg" style={{ backgroundImage: 'url(/images/apollo15.png)' }} />
      <div className="profile-bg-overlay" />

      <div className="profile-content">

        {/* ── HERO ── */}
        <section className="profile-hero">
          <span className="profile-eyebrow">EXPLORER PROFILE &nbsp;/&nbsp; PREVIEW</span>
          <h1 className="profile-title">Your next giant leap<br />starts here.</h1>
          <p className="profile-subtitle">
            Your missions, discoveries, and equipment —<br />
            all in one corner of the universe.
          </p>
        </section>

        {/* ── MISSION BRIEFING CARD ── */}
        <section className="profile-briefing-wrap">
          <div className="profile-briefing-card">
            <span className="profile-card-tag">MISSION BRIEFING</span>
            <h2 className="profile-mission-title">Apollo 15</h2>
            <p className="profile-mission-desc">
              Explore the lunar surface, drive the Lunar Rover,<br />
              and deploy the ALSEP Seismometer.
            </p>
            <button className="profile-btn-primary" onClick={() => navigate('/play/apollo15')}>
              View mission briefing &nbsp;→
            </button>
          </div>
        </section>

        {/* ── SPACE BAG ── */}
        <section className="profile-bag-section">
          <div className="profile-bag-header">
            <div className="profile-bag-left">
              <span className="profile-eyebrow profile-eyebrow-purple">A PLACE FOR EVERY DISCOVERY</span>
              <p className="profile-bag-intro">
                Collect equipment, revisit what you've learned, and prepare for the next chapter of your exploration.
              </p>
            </div>
            <div className="profile-bag-right">
              <h2 className="profile-bag-title">Your space bag</h2>
              <p className="profile-bag-sub">Equipment for a journey beyond Earth.</p>
            </div>
          </div>

          {/* Bag with equipment overlaid on the central panel */}
          <div className="profile-bag-visual">
            <div className="profile-bag-illustration">
              <img src="/images/space-bag.png" alt="Space bag" className="profile-bag-img" />

              {/* Inventory grid positioned on the bag's central dark panel
                  Figma coords: bag at (−5170,−8742) 613×637,
                  inventory at (−5045,−8579) 357×332
                  → left offset 125/613=20.4%, top offset 163/637=25.6%
                  → size: 357/613=58.2% wide, 332/637=52.1% tall          */}
              <div className="profile-bag-overlay">
                <span className="profile-overlay-label">EQUIPMENT &nbsp;/&nbsp; SAMPLE ITEMS</span>
                <div className="profile-overlay-grid">
                  {equipment.map((item, i) => (
                    <div key={i} className={`profile-overlay-slot ${item.locked ? 'locked' : ''}`}>
                      <span className="overlay-icon">{item.icon}</span>
                      <span className="overlay-name">{item.name}</span>
                      <span className="overlay-status">{item.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="profile-inventory-note">
            Sample inventory · equipment shown for the concept
          </p>
        </section>

      </div>
    </div>
  )
}
