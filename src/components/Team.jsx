import tw from "tailwind-styled-components";

const Container = tw.div`
  border-2
  border-gray-500
  py-2
  transition
  duration-300
  ease-in-out
  hover:bg-gray-500
  w-full
  my-1
  flex
  col-span-8
`;

const Name = tw.div`
  m-auto
`;

function Team({name, onClick}) {
  return (
    <Container onClick={onClick}>
      <Name>{name}</Name>
    </Container>
  );
}

export default Team;
