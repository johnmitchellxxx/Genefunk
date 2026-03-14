import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DiceProvider } from "@/hooks/use-dice";
import NotFound from "@/pages/not-found";

import Login from "./pages/Login";
import CharacterList from "./pages/CharacterList";
import CharacterSheet from "./pages/CharacterSheet";
import { useAppAuth } from "./hooks/use-api";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

function PrivateRoute({ component: Component, ...rest }: any) {
  const { data: auth, isLoading } = useAppAuth();

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
    </div>
  );

  if (!auth?.isAuthenticated) {
    return <Redirect to="/" />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Login} />
      <Route path="/characters" component={() => <PrivateRoute component={CharacterList} />} />
      <Route path="/characters/:id" component={() => <PrivateRoute component={CharacterSheet} />} />
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
          {/* Full-screen background layer */}
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
          {/* Vignette + color tint overlay */}
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
