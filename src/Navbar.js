import styled from "styled-components";
import { BsPen, BsCheck, BsX, BsArrowLeft } from "react-icons/bs";
import reset_icon from "./assets/reset_icon.svg";

const Wrapper = styled.section`
  z-index: 3;
  position: sticky;
  width: 100%;
  top: 0;
  left: 0;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14.5px 16px;
  box-shadow: 0px 0px 8px 0px #00000040;
  color: var(--color-primary);
  font-weight: 600;

  .icon {
    font-size: 24px;
    cursor: pointer;
  }

  .large {
    font-size: 32px;
  }

  .signup {
    margin: 0 auto;
  }
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Navbar = ({ navStatus, handleDropFile, handleBack, handleEditClick, handleFinished, handleResetSignature }) => {

  return (
    <Wrapper>
      {navStatus === 'noPDF' && <div className="signup">簽個名</div>}
      {navStatus === 'PDF' && <>
        <BsX className="icon large" onClick={handleDropFile} />
        簽個名
        <IconContainer>
          <BsPen className="icon" onClick={handleEditClick} />
          <BsCheck className="icon large" onClick={handleFinished} />
        </IconContainer>
      </>}

      {navStatus === 'signature' && <>
        <BsArrowLeft className="icon" onClick={handleBack} />
        簽個名
        <IconContainer onClick={handleResetSignature}>
          <img className="icon" src={reset_icon} />
        </IconContainer>
      </>}
    </Wrapper>
  );
};

export default Navbar;
