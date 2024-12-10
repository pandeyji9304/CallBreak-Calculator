import React from "react";
import TeamRow from "./TeamRow";

function ScoreTable({ teams, handleBidChange, handlePriorityChange }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Team</th>
          <th>Bid</th>
          <th>Priority</th>
          <th>Score</th>
        </tr>
      </thead>
      <tbody>
        {teams.map((team, index) => (
          <TeamRow
            key={index}
            team={team}
            index={index}
            handleBidChange={handleBidChange}
            handlePriorityChange={handlePriorityChange}
          />
        ))}
      </tbody>
    </table>
  );
}

export default ScoreTable;
