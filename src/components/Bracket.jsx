import domtoimage from "dom-to-image";
import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

import styled from "styled-components";
import tw from "tailwind-styled-components";
import RoundPart from "./RoundPart";

const space = "\u00a0";

const setTeamFunc = (bracket, setBracket) => (round, match, team) => {
  setBracket(setTeamInBracket(bracket, round, match, team));
};

const setTeamInBracket = (bracket, round, match, team) => {
  const newBracket = JSON.parse(JSON.stringify(bracket));
  if (round < newBracket.length - 3) {
    // Normal round
    newBracket[round + 1][Math.floor(match / 2)][match % 2] = team;
  } else if (round === newBracket.length - 3) {
    // Clicking on a semi-finalist
    newBracket[round + 1][match % 2][0] = team;
  } else if (round === newBracket.length - 2) {
    // Clicking on a finalist
    newBracket[round + 1][0][0] = team;
  } else {
    // We have clicked on the winner
    return;
  }
  return newBracket;
};

const startingRound = [
  ["Pokémon GO", "PokéPark: Fishing Rally DS"],
  ["Pokémon Pinball: Ruby & Sapphire", "Pokémon Stadium (JP)"],
  [
    "Pokémon Trading Card Game Online",
    "PMD: Blazing/Stormy/Light Adventure Squad",
  ],
  ["Pokémon Ranger", "Learn with Pokémon: Typing Adventure"],
  ["Pokémon Smile", "PTCG 2: The Invasion of Team GR!"],
  ["Hey You, Pikachu!", "Detective Pikachu"],
  ["PMD: Red & Blue Rescue Team", "Pokémon Picross"],
  ["Pokémon Battle Revolution", "Pokémon Art Academy"],
  ["Pokémon Masters EX", "Pokémon Rumble U"],
  ["Pokémon XD: Gale of Darkness", "PokéPark 2: Wonders Beyond"],
  ["Pokémon Trading Card Game", "Pokémon Rumble"],
  ["New Pokémon Snap", "Pokémon Channel"],
  ["Pokémon Shuffle", "Pokémon Battrio"],
  ["PMD: Explorers of Sky", "Pokémon Dash"],
  ["PMD: Explorers of Time & Darkness", "Detective Pikachu Returns"],
  ["Pokémon Ranger: Shadows of Almia", "Pokémon Puzzle League"],
  ["Pokémon UNITE", "The Thieves and the 1000 Pokémon"],
  ["PMD: Gates to Infinity", "Pokémon Trading Card Game Live"],
  ["Pokkén Tournament", "Pokémon Puzzle Challenge"],
  ["Pokémon Stadium 2", "Pokémon Dream World"],
  ["Pokémon Sleep", "PokéWalker"],
  ["Pokémon Super Mystery Dungeon", "Pokémon Trozei!"],
  ["Pokémon Stadium", "Pokémon Rumble World"],
  ["PMD: Rescue Team DX", "My Pokémon Ranch"],
  ["Pokémon Quest", "Pokémon Play It!"],
  ["Pokémon Rumble Blast", "PokéPark Wii: Pikachu's Adventure"],
  ["Pokémon Snap", "Pokémon Battle Trozei"],
  ["Pokémon Colosseum", "Pokédex 3D"],
  ["Pokémon: Magikarp Jump", "Pokémon Rumble Rush"],
  ["Pokémon Ranger: Guardian Signs", "Pokémon Conquest"],
  ["Pokémon Pinball", "Pokédex 3D Pro"],
  ["Pokémon Café ReMix", "Pokémon Dream Radar"],
];

const year = "2024";
const roundId = `ise-march-madness-${year}`;
const version = 1;

const setupBracket = (setBracket) => {
  const newBracket = [startingRound];
  let numberInRound = startingRound.length;
  while (numberInRound >= 1) {
    numberInRound = numberInRound / 2;
    let round;
    if (numberInRound > 1) {
      round = new Array(numberInRound).fill([space, space]);
    } else if (numberInRound === 1) {
      round = [[space], [space]];
    } else {
      round = [[space]];
    }
    newBracket.push(round);
  }
  setBracket(newBracket);
};

const Bracket = tw.div`
  md:px-5
`;

const NameInput = tw.input`
  border-2 border-blue-500 font-bold text-blue-500 px-4 py-3 transition duration-300 ease-in-out mr-6
  col-start-4
`;

const Button = tw.button`
  border-2 border-blue-500 font-bold text-blue-500 px-4 py-3 transition duration-300 ease-in-out
  
  hover:bg-blue-500 hover:text-white
  disabled:text-gray-500 disabled:border-gray-500 disabled:bg-transparent disabled:cursor-default
  mr-6
`;

const Random = tw(Button)`
  col-start-3
`;

const Submit = tw(Button)`
  col-start-5
`;

const Clear = tw(Button)`
  col-start-2
`;

const Download = tw(Button)`
  border-2 border-blue-500 font-bold text-blue-500 px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white mr-6
  col-start-6
  hidden
  md:block
`;

const ExportArea = styled(tw.form`
  p-4
  grid
`)`
  grid-template-columns: 1fr auto auto auto auto auto;
`;

export const bracketMachine = Machine(
  {
    id: "bracket",
    initial: "unsubmitted",
    states: {
      unsubmitted: {
        on: {
          SUBMIT: {
            target: "submitted",
            actions: ["save"],
          },
        },
      },
      submitted: {
        on: {
          RESET: {
            target: "unsubmitted",
            actions: ["save"],
          },
        },
      },
    },
  },
  {
    actions: {
      save: (_, __, data) => {
        const jsonState = JSON.stringify(data.state);

        try {
          localStorage.setItem(`submit-state-${roundId}-${version}`, jsonState);
        } catch (e) {}
      },
    },
  }
);

const persistedState =
  JSON.parse(localStorage.getItem(`submit-state-${roundId}-${version}`)) ||
  bracketMachine.initialState;

function BracketView() {
  const [state, send] = useMachine(bracketMachine, { state: persistedState });
  let localStorageState;
  try {
    localStorageState = JSON.parse(
      localStorage.getItem(`bracket-${roundId}-${version}`)
    );
  } catch (e) {
    localStorageState = [];
  }
  const [bracket, setBracket] = useState(localStorageState || []);
  const changeBracket = (bracket) => {
    localStorage.setItem(
      `bracket-${roundId}-${version}`,
      JSON.stringify(bracket)
    );
    setBracket(bracket);
  };

  const setTeam = setTeamFunc(bracket, changeBracket);
  const [name, setName] = useState("");
  useEffect(() => {
    if (bracket.length === 0) {
      setupBracket(setBracket);
    }
  }, [bracket]);

  const submitBracket = (e) => {
    e.preventDefault();
    if (!readyToSubmit()) {
      return;
    }
    let csv = name;
    bracket.slice(1).forEach((round) => {
      round.forEach((match) => {
        match.forEach((team) => {
          csv += `,${team}`;
        });
      });
    });
    email(csv, name);
  };

  const clearBracket = (e) => {
    e.preventDefault();
    setupBracket(changeBracket);
    send("RESET");
  };

  const email = (csv, name) => {
    const formData = new FormData();
    formData.append("csv", csv);
    formData.append("form-name", "csv-submit");
    formData.append("subject", `Form submission from ${name} ${year}`);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(formData).toString(),
    })
      .then((e) => {
        if (e.status === 200 || e.status === 204) {
          send("SUBMIT");
        }
      })
      .catch((error) => alert(error));
  };

  const downloadImage = (e) => {
    e.preventDefault();
    const element = document.getElementById("bracket-for-image");
    domtoimage
      .toPng(element)
      .then(function (dataUrl) {
        var a = document.createElement("a");
        a.href = dataUrl;
        a.download = `${roundId}.png`;
        a.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const readyToSubmit = () => {
    return (
      bracket.every((round) => {
        return round.every((match) => {
          return match[0] !== space && match[1] !== space;
        });
      }) && name.trim()
    );
  };

  const random = (e) => {
    e.preventDefault();
    let newBracket = JSON.parse(JSON.stringify(bracket));
    for (let roundIdx = 0; roundIdx < newBracket.length - 1; roundIdx++) {
      const round = newBracket[roundIdx];
      if (roundIdx === 5) {
        const winnerNum = Math.round(Math.random() * 1);
        const winner = round[winnerNum][0];
        newBracket = setTeamInBracket(newBracket, roundIdx, winnerNum, winner);
      } else {
        for (let matchIdx = 0; matchIdx < round.length; matchIdx++) {
          const match = round[matchIdx];
          const winner = match[Math.round(Math.random() * 1)];
          newBracket = setTeamInBracket(newBracket, roundIdx, matchIdx, winner);
        }
      }
    }
    changeBracket(newBracket);
  };

  const submissionsOpen = true;

  return (
    <Bracket>
      <RoundPart bracket={bracket} setTeam={setTeam}></RoundPart>
      <ExportArea
        name="submit"
        method="POST"
        data-netlify="true"
        id="submitForm"
      >
        {submissionsOpen && <Clear onClick={clearBracket}>Reset</Clear>}
        {state.matches("submitted") ||
          (submissionsOpen && <Random onClick={random}>Choose For Me</Random>)}
        {state.matches("submitted") ||
          (submissionsOpen && (
            <NameInput
              onChange={(event) => setName(event.target.value)}
              value={name}
              placeholder="Slack Name"
              name="name"
            />
          ))}
        {state.matches("submitted") ||
          (submissionsOpen && (
            <Submit
              onClick={submitBracket}
              type="submit"
              disabled={!readyToSubmit()}
            >
              Submit Predictions
            </Submit>
          ))}
        <Download onClick={downloadImage}>Download as Image</Download>
      </ExportArea>
    </Bracket>
  );
}

export default BracketView;
