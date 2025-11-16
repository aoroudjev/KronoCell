
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import {ThemeProvider} from "next-themes";
  import { Theme } from "@radix-ui/themes";

  createRoot(document.getElementById("root")!).render(
      <ThemeProvider attribute={"class"}>
          <Theme>
              <App />
          </Theme>
      </ThemeProvider>
  );
  