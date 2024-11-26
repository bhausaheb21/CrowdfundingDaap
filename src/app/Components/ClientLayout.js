// Components/ClientLayout.js
"use client";


import Header from "./Header";
import styled, { ThemeProvider } from "styled-components";
import themes from "./themes";
import { themeatom } from "../../../State/themeatom";
import { useRecoilValueLoadable } from "recoil";
import { useRouter } from "next/router";
// import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function ClientLayout({ children }) {
  const theme = useRecoilValueLoadable(themeatom);

  // const router = useRouter()
  return (
    theme.state == 'hasValue' ?
      <ThemeProvider theme={themes[theme.contents]}>

        <LayoutWrapper >
          
          <Header />
          {children}
        </LayoutWrapper>
      </ThemeProvider> : <>
      </>
  );
}

const LayoutWrapper = styled.div`
  min-height : 100vh;
//   margin : -10px;
  background-color :${(props) => props.theme.bgColor};
  background-image : ${(props) => props.theme.bgImage};
  color : ${(props) => props.theme.color}
`
