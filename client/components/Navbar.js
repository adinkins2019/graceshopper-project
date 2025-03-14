// Import modules
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import history from '../history';

// Import Redux action & thunk creators
import { logout } from '../store';
import { getProducts } from '../store/products';
import { clearStorage, getCartProducts } from '../store/cart';
import { searchProducts } from '../store/search';

class Navbar extends React.Component {
  constructor() {
    super();
    this.state = {
      cartHover: false,
      value: '',
    };
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseRelease = this.mouseRelease.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit() {
    this.setState({ value: '' });
  }

  mouseOver() {
    this.setState({ cartHover: true });
  }

  mouseRelease() {
    this.setState({ cartHover: false });
  }

  async componentDidMount() {
    await this.props.getProducts();
    this.props.getCartProducts();
  }

  render() {
    const { handleClick, isLoggedIn, cart, products } = this.props;

    let cartProducts = [];
    for (let productId in cart) {
      cartProducts = [
        ...cartProducts,
        ...products.filter((product) => product.id === Number(productId)),
      ];
    }

    return (
      <nav
        className="navbar navbar-expand-lg navbar-light"
        style={{ backgroundColor: '#c79e5f' }}
      >
        <div className="container-fluid">
          <Link to={isLoggedIn ? '/home' : '/'}>
            <h1 className="navbar-brand" id="main-header">
              FLUFFY & CRUNCHY
            </h1>
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              {isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link to="/home">
                      <p className="nav-link">Home</p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="#">
                      <p className="nav-link" href="#" onClick={handleClick}>
                        Logout
                      </p>
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login">
                      <p className="nav-link">
                        Login
                        <i className="bi bi-box-arrow-right"></i>
                      </p>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/signup">
                      <p className="nav-link">
                        Sign Up
                        <i className="bi bi-check-circle"></i>
                      </p>
                    </Link>
                  </li>
                </>
              )}
              <li className="nav-item">
                <Link to="/products">
                  <p className="nav-link">
                    Products <i className="bi bi-bag"></i>
                  </p>
                </Link>
              </li>
              <li
                className="nav-item"
                onClick={() => history.push('/cart')}
                onMouseOver={() => this.mouseOver()}
                onMouseOut={() => this.mouseRelease()}
              >
                <p
                  className={`nav-link dropdown-toggle ${
                    this.state.cartHover ? 'show' : null
                  }`}
                  id="dropdownMenuOffset"
                  data-bs-toggle="dropdown"
                  aria-expanded={this.state.cartHover ? 'true' : 'false'}
                >
                  Cart <i className="bi bi-cart2"></i>
                </p>
                <ul
                  className={`dropdown-menu ${
                    this.state.cartHover ? 'show' : null
                  }`}
                  aria-labelledby="dropdownMenuLink"
                >
                  <li className="dropdown-item">
                    <h1>Currently Added</h1>
                  </li>
                  {cartProducts.map((product) => (
                    <li key={product.id}>
                      <hr />
                      <div className="dropdown-item">
                        <img
                          src={product.imageUrl}
                          className="cart-preview-image"
                        />
                        <p>
                          <strong className="cart-name">{product.name}</strong>
                        </p>{' '}
                        <p>Price: ${product.price}</p>
                        <p>Quantity: {cart[product.id]}</p>
                        <p>
                          <strong>
                            Total: ${cart[product.id] * product.price}
                          </strong>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="nav-item">
                <form id="search-form">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={this.state.value}
                    onChange={this.handleChange}
                  />
                  <Link to={`/products/search/${this.state.value}`}>
                    <button
                      className="btn btn-outline-success"
                      onClick={() => {
                        this.props.searchProducts(this.state.value);
                        this.handleSubmit();
                      }}
                    >
                      Search
                    </button>
                  </Link>
                </form>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}
/**
 * CONTAINER
 */
const mapState = (state) => {
  return {
    products: state.products,
    isLoggedIn: !!state.auth.id,
    cart: state.cart,
  };
};

const mapDispatch = (dispatch) => {
  return {
    getProducts: () => dispatch(getProducts()),
    searchProducts: (query) => dispatch(searchProducts(query)),
    getCartProducts: () => dispatch(getCartProducts()),
    handleClick() {
      dispatch(logout());
      dispatch(clearStorage());
    },
  };
};

export default connect(mapState, mapDispatch)(Navbar);
