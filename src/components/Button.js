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

  label {
    cursor: pointer;
    display: inline-block;
    width: 100%;
  }
`;
const ButtonContainer = styled.div`
  position: absolute;
  top: calc(50% + 124px);
  padding: 0 24px;
  width: 100%;
`;

const Button = ({ handlePdfFileChange }) => {
  return (
    <ButtonContainer>
      <Wrapper>
        <label htmlFor="files">選擇檔案</label>
        <input
          id="files"
          type="file"
          accept="application/pdf"
          onChange={handlePdfFileChange}
          style={{ display: "none" }}
        />
      </Wrapper>
    </ButtonContainer>
  );
};

export default Button;
