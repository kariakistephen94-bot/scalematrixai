export default function Header() {
  return (
    <header>
      <nav className="wrap">
        <a className="brand" href="#">
          <img
            className="wordmark"
            src="logo.svg"
            alt="ScaleMatrix AI"
            width="270"
            height="28"
          />
        </a>
        <div className="navright">
          <span className="availability">
            <i></i>
            Accepting new partners
          </span>
          <a href="#application" className="button small">
            Book A Demo Call
            <span>↗</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
