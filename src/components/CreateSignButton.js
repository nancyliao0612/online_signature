import styled from "styled-components";

const Wrapper = styled.div`
  border-radius: 4px;
  background-color: var(--color-primary);
  max-width: 384px;
  height: 45px;
  text-align: center;
  margin: 0 auto;
  line-height: 45px;
  color: var(--color-white);
  cursor: pointer;

  label {
    cursor: pointer;
  }
`;
const ButtonContainer = styled.div`
  position: absolute;
  bottom: 24px;
  padding: 0 24px;
  width: 100%;
`;

const CreateSignButton = ({ handleCreateSign }) => {
  return (
    <ButtonContainer>
      <Wrapper onClick={handleCreateSign}>
        <label for="files" >創建簽名</label>
      </Wrapper>
    </ButtonContainer>
  );
};

export default CreateSignButton;
