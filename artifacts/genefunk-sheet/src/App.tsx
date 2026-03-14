import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DiceProvider } from "@/hooks/use-dice";
import NotFound from "@/pages/not-found";

import CharacterList from "./pages/CharacterList";
import CharacterSheet from "./pages/CharacterSheet";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/characters" />} />
      <Route path="/characters" component={CharacterList} />
      <Route path="/characters/:id" component={CharacterSheet} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DiceProvider>
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 0,
              backgroundImage: `url('${base}/images/genefunk-bg.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'saturate(0.75) brightness(0.45)',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1,
              background: 'radial-gradient(ellipse at center, transparent 30%, hsl(240 10% 3% / 0.7) 100%), linear-gradient(180deg, hsl(190 100% 10% / 0.15) 0%, hsl(240 10% 3% / 0.3) 100%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <WouterRouter base={base}>
              <Router />
            </WouterRouter>
            <Toaster />
          </div>
        </DiceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
