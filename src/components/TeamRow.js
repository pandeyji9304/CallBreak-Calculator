import React from "react";

function TeamRow({ team, index, handleBidChange, handlePriorityChange }) {
  return (
    <tr>
      <td>{team.name}</td>
      <td>
        <input
          type="number"
          value={team.bid}
          onChange={(e) => handleBidChange(index, e.target.value)}
        />
      </td>
      <td>
        <button onClick={() => handlePriorityChange(index)}>
          Change Priority
        </button>
      </td>
      <td>{team.score}</td>
    </tr>
  );
}

export default TeamRow;
