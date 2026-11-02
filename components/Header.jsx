import Logo from "./Logo";

export default function Header() {
  return (
    <header className="site-header" data-scrolled="false" data-hidden="false">
      <nav className="wrap">
        <a className="brand" href="#" aria-label="ScaleMatrix AI — back to top">
          <Logo id="logo-head" className="wordmark" />
        </a>
        <div className="navlinks">
          <a href="#results">Results</a>
          <a href="#system">The System</a>
          <a href="#application">Apply</a>
        </div>
        <div className="navright">
          <span className="availability">
            <i></i>
            Accepting new partners
          </span>
          <a href="#application" className="button small" data-magnetic>
            Book A Demo Call
            <span>↗</span>
          </a>
        </div>
      </nav>
      <div className="page-progress" aria-hidden="true"></div>
    </header>
  );
}
