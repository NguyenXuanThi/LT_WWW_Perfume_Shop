import { BrowserRouter } from "react-router-dom";
import Navigator from "./navigate/navigator";
import { Provider } from "react-redux"
import { store } from "@/store"
import "./App.css";
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Navigator />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
