import domtoimage from "dom-to-image";
import { useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import { Machine } from "xstate";

import styled from "styled-components";
import tw from "tailwind-styled-components";
import RoundPart from "./RoundPart";
import Tooltip from "./Tooltip";
import Button from "./Button";

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
  ["Mimikyu", "Kubfu line"],
  ["Marshadow", "Scorbunny line"],
  ["Grookey line", "Sobble line"],
  ["Impidimp line", "Raging Bolt"],
  ["Rockruff line", "Alolan Sandshrew line"],
  ["Zacian", "Cramorant"],
  ["Litten line", "Miraidon"],
  ["Sprigatito line", "Pawmi line"],
  ["Applin line", "Meltan line"],
  ["Flamigo", "Grubbin line"],
  ["Charcadet line", "Finizen line"],
  ["Chien-Pao", "Bounsweet line"],
  ["Rookidee line", "Sizzlipede line"],
  ["Smoliv line", "Sandygast line"],
  ["Alolan Vulpix line", "Nickit line"],
  ["Wooloo line", "Clobbopus line"],
  ["Dreepy line", "Poipole line"],
  ["Jangmo-o line", "Snom line"],
  ["Hisuian Zorua line", "Gimmighoul line"],
  ["Toxel line", "Dracovish"],
  ["Tinkatink line", "Tapu Koko"],
  ["Hisuian Sneasel line", "Sinistea line"],
  ["Cosmog line", "Duraludon line"],
  ["Annihilape", "Hisuian Growlithe line"],
  ["Frigibax line", "Kingambit"],
  ["Galarian Zigzagoon line", "Roaring Moon"],
  ["Paldean Wooper line", "Necrozma"],
  ["Cutiefly line", "Stufful line"],
  ["Rowlet line", "Rolycoly line"],
  ["Yamper line", "Cetoddle line"],
  ["Galarian Ponyta line", "Milcery line"],
  ["Type: Null line", "Tandemaus line"],
];

const year = "2025";
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
  border-2 border-blue-500 font-bold text-blue-500 px-4 py-3 transition duration-300 ease-in-out
  col-span-4
`;

const Random = tw(Button)`
  col-span-2
`;

const Submit = tw(Button)`
  col-span-2
`;

const Clear = tw(Button)`
  col-span-2
`;

const Download = tw(Button)`
  border-2 border-blue-500 font-bold text-blue-500 px-4 py-3 transition duration-300 ease-in-out hover:bg-blue-500 hover:text-white mr-6
  col-span-2
  hidden
  md:block
`;

const ExportArea = styled(tw.form`
  p-4
  grid
  grid-cols-6
  grid-rows-2
  md:grid-rows-1
  md:grid-cols-12
`)`
  grid-gap: 10px;
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

  const bracketFilledOut = () =>
    bracket.every((round) => {
      return round.every((match) => {
        return match[0] !== space && match[1] !== space;
      });
    });

  const readyToSubmit = () => bracketFilledOut() && name.trim();

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
        <Download onClick={downloadImage}>Download as Image</Download>
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
            <Tooltip
              text={
                bracketFilledOut()
                  ? "Enter your name"
                  : "Select a winner of every match in every round"
              }
              enabled={!readyToSubmit()}
            >
              <Submit
                onClick={submitBracket}
                type="submit"
                disabled={!readyToSubmit()}
              >
                Submit Predictions
              </Submit>
            </Tooltip>
          ))}
      </ExportArea>
    </Bracket>
  );
}

export default BracketView;
