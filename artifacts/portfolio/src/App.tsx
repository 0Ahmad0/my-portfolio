import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { PortfolioProvider } from "@/contexts/PortfolioContext";
import PrimaryColorController from "@/components/PrimaryColorController";
import Loader from "@/components/Loader";
import { ThemeProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Portfolio from "@/pages/Portfolio";
const Dashboard = lazy(() => import("@/pages/Dashboard"));

function Router() {
  return (
    <Switch>
      <Route path="/" component={Portfolio} />
      <Route path="/dashboard">
        <Suspense
          fallback={
            <main className="min-h-[100dvh] grid place-content-center">
              <Loader />
            </main>
          }
        >
          <Dashboard />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <PortfolioProvider>
        <PrimaryColorController />
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;
