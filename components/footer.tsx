import Image from "next/image"

export function Footer() {
  return (
    <footer className="site-footer">
      {/* Background image */}
      <Image
        src="/images/footer.jpg"
        alt=""
        fill
        className="footer-bg-image"
        aria-hidden="true"
      />
      {/* Dark overlay */}
      <div className="footer-overlay" aria-hidden="true" />
      <div className="footer-glow" aria-hidden="true" />

      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Image
              src="/images/SB-LX1.webp"
              alt="Super Bowl LX"
              width={48}
              height={36}
              className="footer-logo"
            />
            <div className="footer-brand-text">
              <span className="footer-title">PROP PICKS</span>
              <span className="footer-tagline">Super Bowl LX &bull; New Orleans</span>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-col">
              <span className="footer-col-heading">GAME</span>
              <a href="#" className="footer-link">Props</a>
              <a href="#" className="footer-link">Leaderboard</a>
              <a href="#" className="footer-link">How to Play</a>
            </div>
            <div className="footer-col">
              <span className="footer-col-heading">INFO</span>
              <a href="#" className="footer-link">Rules</a>
              <a href="#" className="footer-link">FAQ</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <p className="footer-legal">
            This is a free, unofficial prop picking game. Not affiliated with the NFL, NBC, or any team.
          </p>
          <p className="footer-copy">
            &copy; 2025 Prop Picks. For entertainment purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
