import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-light-grey);
  color: var(--color-primary);
  border-radius: 100%;
  width: 33px;
  height: 33px;
`;

const Circle = ({ number }) => {
  return <Wrapper>{number}</Wrapper>;
};

export default Circle;
