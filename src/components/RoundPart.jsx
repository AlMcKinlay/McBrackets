import Match from "./Match";
import tw from "tailwind-styled-components";
import { useState } from "react";

const RoundNames = [
  "round-of-64",
  "round-of-32",
  "round-of-16",
  "quarter-final",
  "semi-final",
  "final",
  "winner",
];

const Container = tw.div`
  grid
  grid-cols-1
  md:grid-cols-7
  xl:grid-cols-13
`;

const Round = tw.div`
  ${({ level, activeround }) => level !== activeround && "hidden"}
  md:contents
`;

const RoundSwitcher = tw.div`
  md:hidden
  grid
  grid-flow-col
  grid-cols-10
  ${({ level, activeround }) => level !== activeround && "hidden"}
  col-start-1
  row-start-1
  col-span-1
`;

const RoundName = tw.div`
  col-span-8
  col-start-2
  py-2
  m-auto
`;

const BackButton = tw.button`
  ${({ activeround }) => activeround === 0 && "hidden"}
  col-start-1
`;

const ForwardButton = tw.button`
  ${({ activeround, totalrounds }) =>
    activeround === totalrounds - 1 && "hidden"}
  col-start-10
`;

function RoundPart({ bracket, setTeam }) {
  const [activeRound, setRound] = useState(0);
  const previousRound = () =>
    setRound(activeRound > 0 ? activeRound - 1 : activeRound);
  const nextRound = () =>
    setRound(activeRound < bracket.length - 1 ? activeRound + 1 : activeRound);
  return (
    <div id="bracket-for-image">
      <Container>
        {bracket.map((round, level) => (
          <Round
            className={RoundNames[level]}
            key={RoundNames[level]}
            activeround={activeRound}
            level={level}
          >
            <RoundSwitcher activeround={activeRound} level={level}>
              <BackButton onClick={previousRound} activeround={activeRound}>
                &lt;
              </BackButton>
              <RoundName>{RoundNames[level].replace(/-/g, " ")}</RoundName>
              <ForwardButton
                onClick={nextRound}
                activeround={activeRound}
                totalrounds={bracket.length}
              >
                &gt;
              </ForwardButton>
            </RoundSwitcher>
            {round.map((match, roundorder) => (
              <Match
                key={roundorder}
                team1={match[0]}
                team2={match[1]}
                level={level}
                roundorder={roundorder}
                total={round.length}
                activeround={activeRound}
                setTeam={(team) => setTeam(level, roundorder, team)}
              />
            ))}
          </Round>
        ))}
      </Container>
    </div>
  );
}

export default RoundPart;
