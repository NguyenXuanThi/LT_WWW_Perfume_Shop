import { BrowserRouter } from "react-router-dom";
import Navigator from "./navigate/navigator";
import { Provider } from "react-redux";
import { store } from "@/store";
import { CartProvider } from "./components/cart/CartContext";

import "./App.css";

function App() {
    return (
        <Provider store={store}>
            <CartProvider>
                <BrowserRouter>
                    <Navigator />
                </BrowserRouter>
            </CartProvider>
        </Provider>
    );
}

export default App;
