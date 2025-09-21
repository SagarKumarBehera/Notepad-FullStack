import "./App.css";
import Navbar from "./Components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ChakraProvider } from "@chakra-ui/react";
import Allroutes from "./Routes/Allroutes";

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      {" "}
      <ChakraProvider>
        <Navbar />
        <Allroutes />
      </ChakraProvider>
    </ThemeProvider>
  );
}

export default App;
