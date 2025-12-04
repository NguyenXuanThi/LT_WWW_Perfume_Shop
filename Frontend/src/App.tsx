import { BrowserRouter } from "react-router-dom";
import Navigator from "./navigate/navigator";
import "./App.css";
function App() {
  return (
    <BrowserRouter>
      <Navigator />
    </BrowserRouter>
  );
}

export default App;
