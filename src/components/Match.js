import Team from "./Team";
import tw from "tailwind-styled-components";

const Container = tw.div`
    grid
    grid-flow-col
    grid-cols-10
    grid-rows-1
    content-around
    w-full
    ${({level, roundorder, total, activeround}) => activeround === level ? 'col-start-1' : 'col-start-2'}
    ${({level, roundorder, total}) => `md:col-start-${1 + level}`}
    ${({level, roundorder, total}) => `row-start-${level === 5 ? 2 + roundorder * 32 : 2 + (Math.pow(2, level + 1) * roundorder)}`}
    ${({level, roundorder, total}) => `md:row-start-${level === 5 ? 1 + roundorder * 32 : 1 + (Math.pow(2, level + 1) * roundorder)}`}
    ${({level}) => `row-span-${level < 5 ? Math.pow(2, level + 1) : level === 5 ? "32" : "64"}`}
    ${({level, roundorder, total}) => `xl:col-start-${roundorder < total / 2 ? 1 + level : 13 - level}`}
    ${({level, roundorder, total}) => `xl:row-start-${roundorder < total / 2 ? 1 + (Math.pow(2, level + 1) * roundorder) : 1 + (Math.pow(2, level + 1) * (roundorder - (total / 2)))}`}
    ${({level}) => `xl:row-span-${level < 5 ? Math.pow(2, level + 1) : "32"}`}
`;

const Teams = tw.div`
  grid
  col-span-8
  col-start-2
  content-around
`;

const ConnectorsOutgoing = tw.div`
  grid
  grid-rows-4
  ${({roundorder, total}) => `xl:col-start-${roundorder < (total / 2) ? 10 : 1}`}
`;

const ConnectorsIncoming = tw.div`
  grid
  grid-rows-4
  ${({roundorder, total}) => `xl:col-start-${roundorder < (total / 2) ? 1 : 10}`}
`;

const ConnectorBottom = tw.div`
  h-full
  border-b-2
`;

const ConnectorTop = tw.div`
  h-full
  border-t-2
`;

const ConnectorTopFinal = tw.div`
  h-full
  border-t-2
  row-span-2
  xl:row-span-1
  border-r-2
  xl:border-r-0
`;

const ConnectorBottomFinal = tw.div`
  h-full
  border-b-2
  row-span-2
  xl:border-b-0
  border-r-2
  xl:border-r-0
`;

const ConnectorTopFinal2 = tw.div`
  hidden
  h-full
  border-t-2
  xl:block
  xl:row-span-1
  xl:border-r-0
`;

const ConnectorSide = tw.div`
  row-span-2
  border-r-2
  xl:border-r-0
  ${({roundorder, total}) => `xl:border-${roundorder < (total / 2) ? "r" : "l"}-2`}
`;

const ConnectorSpace = tw.div`
  row-span-2
`;

function Match({team1, team2, level, roundorder, total, setTeam, activeround}) {
  const selectTeam = (team) => {
    if (team1 === "\u00a0" || team2 === "\u00a0") {
      console.log("One of the teams isn't set yet");
      return;
    }

    setTeam(team);
  }
  return (
    <Container className="match" level={level} roundorder={roundorder} total={total} activeround={activeround}>
      
      {team2 ? 
        <ConnectorsIncoming roundorder={roundorder} total={total}>
          {level > 0 && <><ConnectorBottom></ConnectorBottom><ConnectorSpace></ConnectorSpace><ConnectorTop></ConnectorTop></>}
        </ConnectorsIncoming>
       : 
        <ConnectorsIncoming roundorder={roundorder} total={total}>
          <ConnectorSpace></ConnectorSpace>
          <ConnectorTop></ConnectorTop>
        </ConnectorsIncoming>
       }
      <Teams>
        <Team name={team1} onClick={() => team2 && selectTeam(team1)}></Team>
        {team2 && <Team name={team2} onClick={() => selectTeam(team2)}></Team>}
      </Teams>
      {team2 ?
        <ConnectorsOutgoing roundorder={roundorder} total={total}>
          <ConnectorBottom></ConnectorBottom>
          <ConnectorSide roundorder={roundorder} total={total}></ConnectorSide>
          <ConnectorTop></ConnectorTop>
        </ConnectorsOutgoing>
       : 
       <ConnectorsOutgoing roundorder={roundorder} total={total}>
         {roundorder === 0 && <ConnectorSpace></ConnectorSpace> }
         {roundorder === 0 && total > 1 ? <ConnectorTopFinal></ConnectorTopFinal> : total === 1 ? <ConnectorTopFinal2></ConnectorTopFinal2> : <><ConnectorBottomFinal></ConnectorBottomFinal><ConnectorTopFinal2></ConnectorTopFinal2></>}
       </ConnectorsOutgoing>
      }
    </Container>
  );
}

export default Match;
