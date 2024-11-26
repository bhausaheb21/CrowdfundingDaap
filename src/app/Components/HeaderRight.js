import React from 'react'
import styled from 'styled-components'
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { themeatom } from '../../../State/themeatom';
import { DarkMode } from '@mui/icons-material';
import Wallet from './Wallet';

function HeaderRight() {
  const [theme, settheme] = useRecoilState(themeatom);

  const changetheme = () => {
    settheme(prev => prev == 'light' ? 'dark' : 'light')
  }
  return (
    <HeaderRightWrapper>
      <Wallet />
      <ThemeToggler onClick={changetheme}>
        {theme == 'light' ? <DarkMode /> : <Brightness7Icon />}
      </ThemeToggler>
    </HeaderRightWrapper>
  )
}


const HeaderRightWrapper = styled.div`
 display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
  height: 60%;
`
const ThemeToggler = styled.div`
display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.bgDiv};
  height: 100%;
  padding: 5px;
  width: 45px;
  border-radius: 12px;
  cursor: pointer;
`
export default HeaderRight
