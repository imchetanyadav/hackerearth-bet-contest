import * as React from "react";
import { useHistory } from "react-router-dom";

import { Candidate } from "../App";

interface Props {
  selectedCandidates: Array<Candidate>;
  onBetResult: (winner: number) => void;
}

const BetPage: React.FC<Props> = ({ selectedCandidates, onBetResult }) => {
  let history = useHistory();
  const winner = React.useMemo(() => getRandomInt(1, 10), []);

  return (
    <>
      <div className="absolute bottom-0 left-0 mb-8 ml-8">
        <button
        className="p-2 bg-primary block text-white rounded-sm w-56"
          onClick={() => {
            onBetResult(winner);
            history.push("/");
          }}
        >
          Back
        </button>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex justify-center">
          {selectedCandidates.slice(0, 5).map((c) => (
            <CandidateCard
              key={c.name}
              candidate={c}
              isWinner={c.bet === winner}
            />
          ))}
        </div>
        <div className="flex items-center justify-center my-8">
          <div className="h-1 w-56 bg-orange-400 mr-8" />
          <div className="bg-black text-orange-400 rounded-full h-40 w-40 text-4xl border-orange-400 border-2 flex items-center justify-center">
            {winner}
          </div>
          <div className="h-1 w-56 bg-orange-400 ml-8" />
        </div>
        <div className="flex justify-center">
          {selectedCandidates.slice(4, 8).map((c) => (
            <CandidateCard
              key={c.name}
              candidate={c}
              isWinner={c.bet === winner}
            />
          ))}
        </div>
      </div>
    </>
  );
};

interface CandidateCardProps {
  candidate: Candidate;
  isWinner: boolean;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  isWinner,
}) => {
  return (
    <div
      className={`bg-white border ${
        isWinner ? "border-green-500" : "border-red-500"
      } mx-5 p-2 text-left rounded-md`}
      style={{ minWidth: 160, width: 160, height: 160 }}
    >
      <div className="flex mb-4">
        <img src={candidate.avatar} alt={candidate.name} className="h-12 w-12 mr-2 rounded-md" />
        <div className="text-sm">{candidate.name}</div>
      </div>
      <div className="flex text-xs">
        <div className="pr-1">
          <span role="img" aria-label="trophy">
            🏆
          </span>{" "}
          {candidate.wins}
        </div>
        <div className="pl-2">
          <span role="img" aria-label="target">
            🎯
          </span>{" "}
          {candidate.bet}
        </div>
      </div>
      <div className="mt-2 text-xs">
        <span role="img" aria-label="money">
          💰
        </span>{" "}
        {candidate.price}
      </div>
      <div
        className={`w-full ${
          isWinner ? "bg-green-500" : "bg-red-500"
        } text-white text-center rounded-sm mt-2`}
      >
        {isWinner ? "Winner" : "Lose"}
      </div>
    </div>
  );
};

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export default BetPage;
