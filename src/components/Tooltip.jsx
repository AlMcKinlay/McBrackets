import tw from "tailwind-styled-components";
import styled from "styled-components";

const Extend = tw.span`
  border-2 border-blue-500 px-4 py-3 transition duration-300 ease-in-out
  
  bg-blue-500 text-white text-s
  absolute z-1 left-0 w-full

  &:after {
    transition duration-300 ease-in-out
  }
`;

const Text = styled(Extend)`
  text-align: center;
  border-radius: 6px;
  bottom: 4rem;
  visibility: hidden;
  opacity: 0;

  &:after {
    border-left: solid transparent 10px;
    border-right: solid transparent 10px;
    border-top: solid rgb(59, 130, 246) 10px;
    bottom: -10px;
    content: " ";
    height: 0;
    left: 50%;
    margin-left: -13px;
    position: absolute;
    width: 0;
  }
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  grid-column: span 2;
  &:hover ${Text} {
    visibility: visible;
    opacity: 1;
  }
`;

function Tooltip(props) {
  const { text, children, enabled } = props;
  return (
    <Container className="parent group">
      {children}
      {enabled && <Text>{text}</Text>}
    </Container>
  );
}

export default Tooltip;
