import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [teams, setTeams] = useState(() => {
    const savedTeams = localStorage.getItem("callBreakTeams");
    return savedTeams
      ? JSON.parse(savedTeams)
      : [
          { name: "Player 1", bid: 0, score: 0, bidMet: null },
          { name: "Player 2", bid: 0, score: 0, bidMet: null },
          { name: "Player 3", bid: 0, score: 0, bidMet: null },
          { name: "Player 4", bid: 0, score: 0, bidMet: null },
        ];
  });

  const [round, setRound] = useState(() => {
    const savedRound = localStorage.getItem("callBreakRound");
    return savedRound ? parseInt(savedRound) : 1;
  });

  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("callBreakHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    localStorage.setItem("callBreakTeams", JSON.stringify(teams));
    localStorage.setItem("callBreakRound", round.toString());
    localStorage.setItem("callBreakHistory", JSON.stringify(history));
  }, [teams, round, history]);

  const handleEditName = (index, newName) => {
    const updatedTeams = [...teams];
    updatedTeams[index].name = newName.trim();
    setTeams(updatedTeams);
  };

  const handleBidChange = (index, type) => {
    const updatedTeams = [...teams];
    let newBid = updatedTeams[index].bid;

    if (type === "increase" && newBid < 8) {
      newBid += 1;
    } else if (type === "decrease" && newBid > 0) {
      newBid -= 1;
    }

    updatedTeams[index].bid = newBid;
    setTeams(updatedTeams);
  };

  const handleBidResult = (index, result) => {
    const updatedTeams = [...teams];
    updatedTeams[index].bidMet = result;
    if (result) {
      updatedTeams[index].score += updatedTeams[index].bid;
    } else {
      updatedTeams[index].score -= updatedTeams[index].bid;
    }
    setTeams(updatedTeams);
  };

  const finalizeRound = () => {
    const allPlayersBidsMet = teams.every((team) => team.bidMet !== null);

    if (!allPlayersBidsMet) {
      alert("Please finalize bids for all players before proceeding.");
      return;
    }

    const roundResult = teams.map((team) => ({
      name: team.name,
      bid: team.bid,
      score: team.score,
      bidMet: team.bidMet,
    }));

    setHistory([roundResult, ...history]);

    const updatedTeams = teams.map((team) => ({
      ...team,
      bid: 0,
      bidMet: null,
    }));
    setTeams(updatedTeams);

    setRound(round + 1);
  };

  const endGame = () => {
    setTeams([
      { name: "Player 1", bid: 0, score: 0, bidMet: null },
      { name: "Player 2", bid: 0, score: 0, bidMet: null },
      { name: "Player 3", bid: 0, score: 0, bidMet: null },
      { name: "Player 4", bid: 0, score: 0, bidMet: null },
    ]);
    setRound(1);
    setHistory([]);
    localStorage.removeItem("callBreakTeams");
    localStorage.removeItem("callBreakRound");
    localStorage.removeItem("callBreakHistory");
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const getBidColumnClass = () => {
    const bids = teams.map((team) => team.bid);
    const highestBid = Math.max(...bids);
    const lowestBid = Math.min(...bids);

    return { highestBid, lowestBid };
  };

  const { highestBid, lowestBid } = getBidColumnClass();

  return (
    <div className="App">
      <h1>Call Break Score Calculator</h1>
      <h2>Round {round}</h2>

      {teams.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Team</th>
                <th className={highestBid === lowestBid ? "normal-column" : highestBid === 0 ? "normal-column" : "green-column"}>Bid</th>
                <th>Bid Met</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) => handleEditName(index, e.target.value)}
                    />
                  </td>
                  <td
                    className={team.bid === highestBid ? "green-column" : team.bid === lowestBid ? "red-column" : "normal-column"}
                  >
                    <div className="bid-buttons">
                      <button onClick={() => handleBidChange(index, "increase")}>+</button>
                      <span>{team.bid}</span>
                      <button onClick={() => handleBidChange(index, "decrease")}>-</button>
                    </div>
                  </td>
                  <td>
                    {team.bidMet === null ? (
                      <>
                        <button onClick={() => handleBidResult(index, true)}>Yes</button>
                        <button onClick={() => handleBidResult(index, false)}>No</button>
                      </>
                    ) : team.bidMet ? (
                      "Yes"
                    ) : (
                      "No"
                    )}
                  </td>
                  <td>{team.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="action-buttons">
        <button className="round-over" onClick={finalizeRound}>
          Finalize Round
        </button>
        <button className="end-game" onClick={endGame}>
          End Game
        </button>
      </div>

      <button onClick={toggleHistory} className="toggle-history-btn">
        {showHistory ? "Hide History" : "Show History"}
      </button>

      {showHistory && history.length > 0 && (
        <div>
          <h3>History of Past Rounds</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>Round</th>
                <th>Player</th>
                <th>Bid</th>
                <th>Bid Met</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {history.map((round, roundIndex) =>
                round.map((entry, entryIndex) => (
                  <tr key={entryIndex}>
                    <td>{roundIndex + 1}</td>
                    <td>{entry.name}</td>
                    <td>{entry.bid}</td>
                    <td>{entry.bidMet ? "Yes" : "No"}</td>
                    <td>{entry.score}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
