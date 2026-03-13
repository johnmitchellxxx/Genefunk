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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DiceProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </DiceProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
