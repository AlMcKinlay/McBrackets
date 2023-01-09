import Bracket from "./components/Bracket";
import "tailwindcss/tailwind.css";
import logo from './logo.png';
import tw from "tailwind-styled-components";

const Logo = tw.img`
  w-80
  m-auto
`;

function App() {
  return (
    <div className="App">
      <nav className="py-4 px-6 border-solid border-b-2 border-gray-500">
        <Logo src={logo} alt="logo" />
      </nav>
    
      <main className="pt-5">
        <Bracket></Bracket>
      </main>
    </div>
  );
}

export default App;
