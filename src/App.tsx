import * as React from "react";
import { Route, Switch, Link, useLocation } from "react-router-dom";

import "./App.css";
import BetPage from "./components/BetPage";
import CandidateTable from "./components/CandidateTable";

export interface Candidate {
  isSelected: boolean;
  name: string;
  avatar: string;
  bet: number;
  wins: number;
  lost: number;
  price: number;
  winnings: number;
  fate: string;
}

const App = () => {
  const location = useLocation();
  const [candidates, updateCandidates] = React.useState<Array<Candidate>>([]);

  React.useEffect(() => {
    fetch(
      "https://s3-ap-southeast-1.amazonaws.com/he-public-data/bets7747a43.json"
    )
      .then((res) => res.json())
      .then((res) => {
        if (res && Array.isArray(res)) {
          updateCandidates(
            res.map((c) => ({
              isSelected: false,
              name: c["Name"],
              avatar: c["Profile Image"],
              bet: parseInt(c["Bet"]),
              wins: 0,
              lost: 0,
              price: parseInt(c["Price"]),
              winnings: 0,
              fate: "",
            }))
          );
        }
      });
  }, []);

  const selectedCandidates = candidates.filter((c) => c.isSelected);
  const onBetResult = (winner: number) => {
    updateCandidates(
      candidates.map((c) =>
        c.isSelected
          ? c.bet === winner
            ? {
                ...c,
                wins: c.wins + 1,
                winnings: c.winnings + c.price * 2,
                fate: "Win",
              }
            : { ...c, lost: c.lost + 1, winnings: 0, fate: "Loss" }
          : c
      )
    );
  };

  return (
    <div className="App">
      {location.pathname === "/" && (
        <aside className="p-5 top-0 left-0 w-64 fixed h-full bg-white border-r-2">
          <div>
            <div className="text-gray-500 text-left mb-8">Playing 9</div>
            {selectedCandidates.map((c) => (
              <div key={c.name} className="flex mb-5">
                <img
                  src={c.avatar}
                  alt={c.name}
                  className="h-12 w-12 mr-2 rounded-md"
                />
                <div className="flex flex-col items-start">
                  <div>{c.name}</div>
                  <div className="flex justify-between text-xs">
                    <div className="pr-1">
                      <span role="img" aria-label="trophy">
                        🏆
                      </span>{" "}
                      {c.wins}
                    </div>
                    <div className="px-2">
                      <span role="img" aria-label="target">
                        🎯
                      </span>{" "}
                      {c.bet}
                    </div>
                    <div className="pl-2">
                      <span role="img" aria-label="money">
                        💰
                      </span>{" "}
                      {c.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {selectedCandidates.length === 9 && (
            <Link
              className="p-2 bg-primary block w-full text-white rounded-sm"
              to="/bet"
            >
              Start
            </Link>
          )}
        </aside>
      )}
      <main className={`${location.pathname === "/" ? "ml-64" : ""}`}>
        <Switch>
          <Route
            path="/"
            exact
            component={() => (
              <CandidateTable
                data={candidates}
                onCandidateSelection={(isSelected: boolean, name: string) => {
                  if (isSelected && selectedCandidates.length > 8) return;

                  updateCandidates(
                    candidates.map((c) =>
                      c.name === name ? { ...c, isSelected } : c
                    )
                  );
                }}
              />
            )}
          />
          <Route
            path="/bet"
            component={() => (
              <BetPage
                selectedCandidates={candidates}
                onBetResult={onBetResult}
              />
            )}
          />
          <Route component={() => <div>404 not found</div>} />
        </Switch>
      </main>
    </div>
  );
};

export default App;
