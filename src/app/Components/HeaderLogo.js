import styled from 'styled-components';
import '../globals.css';

const HeaderLogo = () => {
  return (
    <Logo>Impact Now</Logo>
  )
}

const Logo = styled.h1`
  font-weight: bold;
  font-size: 30px;
  margin-left: 10px;
  font-family: 'Poppins';
  // letter-spacing: px;
  cursor: pointer;
   font-family: "Dancing Script", cursive;
  font-optical-sizing: auto;
  font-weight: 700;
`

export default HeaderLogo