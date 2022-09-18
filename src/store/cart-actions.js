import { cartActions } from "./cart-slice";
import { uiActions } from "./ui-slice";

//action creator fn(AKA thunk) for fetching data from firebase
export const fetchCartData = (cart) => {
  return async (dispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        "https://udemy-react-meals-ed401-default-rtdb.asia-southeast1.firebasedatabase.app/cart.json"
      );

      if (!response.ok) {
        throw new Error("Fetching cart data failed");
      }
      const data = await response.json(); //returns result of taking JSON as input and parsing it to produce a JS object.

      return data;
    };

    try {
      const cartData = await fetchData();
      dispatch(cartActions.replaceCart({
        items: cartData.items || [],
        totalQuantity: cartData.totalQuantity
      }))
    } catch {
      dispatch(
        uiActions.showNotification({
          status: "error",
          title: "Error...",
          message: "Sending cart data failed...",
        })
      );
    }
  };
};
