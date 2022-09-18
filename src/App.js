//useSelector same as mapStateToProps() --> receive current state and return wtv data --> avoid props nesting
import { useSelector, useDispatch } from "react-redux";
import { Fragment, useEffect } from "react";

import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import Notification from "./components/UI/Notification";
import { uiActions } from "./store/ui-slice";
import { fetchCartData } from "./store/cart-actions";

let isInitial = true;

function App() {
  //can dispatch both an action creator that returns action obj OR another fn(fn is executed by redux)
  const dispatch = useDispatch();

  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const notification = useSelector((state) => state.ui.notification);

  //dispatching fn returning action obj
  //alternative: dispatch fn(AKA thunk) returning another fn (so logic not in component)
  //thunk=action creator fn that delays action until later by returning another fn which eventually returns action instead of retunrning action itself
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.showNotification({
          status: "pending",
          title: "Pending...",
          message: "Sending cart data...",
        })
      );
      const response = await fetch(
        "https://udemy-react-meals-ed401-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json",
        {
          method: "PUT",
          body: JSON.stringify({
            items: cart.items,
            totalQuantity: cart.totalQuantity,
          }), //stringify converts js object/array into json
        }
      );

      if (!response.ok) {
        throw new Error("Sending cart data failed");
      }

      dispatch(
        uiActions.showNotification({
          status: "success",
          title: "Success...",
          message: "Sent cart data successfully...",
        })
      );
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    if (cart.changed) {
      sendCartData().catch(
        dispatch(
          uiActions.showNotification({
            status: "error",
            title: "Error...",
            message: "Sending cart data failed...",
          })
        )
      );
    }
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
