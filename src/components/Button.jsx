import tw from "tailwind-styled-components";

const Button = tw.button`
  w-full
  border-2 border-blue-500 font-bold text-blue-500 px-4 py-3 transition duration-300 ease-in-out
  
  hover:bg-blue-500 hover:text-white
  disabled:text-gray-500 disabled:border-gray-500 disabled:bg-transparent disabled:cursor-default
`;

export default Button;
