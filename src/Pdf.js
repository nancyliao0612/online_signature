import styled from "styled-components";
import { ReactComponent as Signature_icon } from "./assets/Signature_icon.svg";
import Circle from "./components/Circle";

const Wrapper = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const IconContainer = styled.div`
  position: absolute;
  top: calc(50% - 145px);
`;

const StepsContainer = styled.div`
  position: absolute;
  top: calc(50% - 65px);
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 56px;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const Pdf = () => {
  return (
    <>
      <Wrapper>
        <IconContainer>
          <Signature_icon />
        </IconContainer>
        <StepsContainer>
          <Step>
            <Circle number={1} />
            上傳檔案
          </Step>
          <Step>
            <Circle number={2} />
            簽署
          </Step>
          <Step>
            <Circle number={3} />
            下載檔案
          </Step>
        </StepsContainer>
      </Wrapper>
    </>
  );
};

export default Pdf;
