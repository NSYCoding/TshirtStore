import { Link } from "react-router-dom";

export default function Navbar() {
  const toggleMenu = () => {
    const menu = document.querySelector("nav ul") as HTMLElement | null;
    if (menu) {
      menu.classList.toggle("show");
    }
  };

  return (
    <nav>
      <h1>
        <Link to="/">NSY</Link>
      </h1>
      <div className="nav-container">
        <div onClick={toggleMenu} className="menu">
          &#9776;
        </div>
        <ul>
          <li>
            <Link to="/">Shop</Link>
          </li>
          <li>
            <Link to="/cart">Cart</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
