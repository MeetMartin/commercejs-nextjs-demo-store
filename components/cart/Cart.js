import React, { Component } from "react";
import Link from "next/link"

import { Transition } from "react-transition-group";
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from "body-scroll-lock";

import CartItem from '../cart/CartItem';

import { connect } from "react-redux";
import { retrieveCart } from '../../store/actions/cartActions';



const duration = 300;

const defaultStyle = {
  transition: `transform ${duration}ms ease-in-out`
};

const transitionStyles = {
  entering: { transform: "translateX(100%)" },
  entered: { transform: "translateX(0)" },
  exiting: { transform: "translateX(100%)" },
  exited: { transform: "translateX(100%)" }
};

const backdropTransitionStyles = {
  entering: { opacity: "0" },
  entered: { opacity: "0.56" },
  exiting: { opacity: "0" },
  exited: { opacity: "0" }
};

class Cart extends Component {
  constructor(props) {
    super(props);

    this.cartScroll = React.createRef();
  }

  /**
  * Retrieve cart and contents client-side to dispatch to store
  */
 componentDidMount() {
  this.props.dispatch(retrieveCart());
}

  componentWillUnmount() {
    clearAllBodyScrollLocks();
  }

  onEntering = () => {
    console.log("entering");
    disableBodyScroll(this.cartScroll.current);
  };

  onExiting = () => {
    enableBodyScroll(this.cartScroll.current);
  };

  render() {
    const { isOpen, toggle } = this.props;
    const { cart } = this.props;

    return (
      <Transition
        in={isOpen}
        timeout={duration}
        unmountOnExit
        onEntering={this.onEntering}
        onExiting={this.onExiting}
      >
        {state => (
          <div className="cart-modal font-weight-regular">
            <div
              className="backdrop"
              style={{
                transition: `opacity ${duration}ms ease-in-out`,
                ...backdropTransitionStyles[state]
              }}
              onClick={() => toggle(false)}
            />

            {/* Cart Main Content */}
            <div
              className="main-cart-content d-flex flex-column"
              style={{
                ...defaultStyle,
                ...transitionStyles[state]
              }}
            >
              {/* Cart Header */}
              <div className="px-4 px-md-5">
                <div className="pt-4 pb-3 borderbottom border-color-black d-flex justify-content-between align-items-center">
                  <p className="font-family-secondary font-size-subheader">
                    Shopping Cart
                  </p>
                  <button
                    className="bg-transparent p-0"
                    onClick={() => toggle(false)}
                  >
                    <img src="/icon/cross.svg" />
                  </button>
                </div>
              </div>
              {cart.total_unique_items > 0 ? (
                <>
                  <div
                    className="flex-grow-1 overflow-auto"
                    ref={this.cartScroll}
                  >
                    {cart.line_items.map(item => (
                      <CartItem
                        item={item}
                      />
                    ))}
                  </div>

                  {/* Cart Footer */}
                  <div className="cart-footer">
                    <div className="mb-3 d-flex">
                      <p className="font-color-light mr-2 font-weight-regular">
                        Subtotal:
                      </p>
                      <p>{cart.subtotal.formatted_with_symbol}</p>
                    </div>
                    <div className="row">
                      <div className="col-6 d-none d-md-block">
                        <button
                          className="h-56 w-100 flex-grow-1 bg-white  border border-color-black px-3"
                          onClick={() => toggle(false)}
                        >
                          Continue Shopping
                        </button>
                      </div>
                      <div className="col-12 col-md-6">
                        <Link href="/checkout/1">
                          <a className="h-56 d-flex align-items-center justify-content-center bg-black w-100 flex-grow-1 font-weight-medium font-color-white px-3"
                          onClick={() => this.generateToken()}>
                            Checkout
                          </a>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="d-flex align-items-center justify-content-center bg-brand300 flex-grow-1 p-4 p-md-5 flex-column">
                  <div className="position-relative cursor-pointer mb-3">
                    <img src="/icon/cart.svg" className="w-32" />
                    <div
                      className="position-absolute font-size-tiny font-weight-bold"
                      style={{ right: "-4px", top: "-4px" }}
                    >
                      0
                    </div>
                  </div>
                  <p className="text-center font-weight-medium">
                    Your Cart is empty
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Transition>
    );
  }
}



export default connect(state => state)(Cart);