import styled from 'styled-components';
// import { useRouter } from 'next/router';
import Link from 'next/link';
import '../globals.css'
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const HeaderNav = () => {
  const route = usePathname()
  // const [route, setRoute] = useState('');


  return (
    <HeaderNavWrapper>
      {/* {route} */}
      <Link href='/'> <HeaderNavLinks $active={route.toString() === "/" ? true : false}>Campaigns</HeaderNavLinks></Link>
      <Link href='/createcampaign'> <HeaderNavLinks $active={route.toString() == "/createcampaign" ? true : false}>Create Campaign</HeaderNavLinks></Link>
      <Link href='/dashboard'><HeaderNavLinks $active={route.toString()=="/dashboard" ? true : false}>Dashboard</HeaderNavLinks></Link>
    </HeaderNavWrapper>
  )
}

const HeaderNavWrapper = styled.div`
  display : flex;
  background-color :${(props)=>props.theme.bgDiv};
  padding : 6px;
  height : 70%;
  border-radius : 10px;
  align-items :center;
  justify-content:space-between;
`

const HeaderNavLinks = styled.div`
  display : flex;
  align-items :center;
  justify-content : space-between;
  height : 100%;
  font-family :Roboto;
  margin : 7px;
  background-color : ${(props)=>props.active ? props.theme.bgSubDiv : props.theme.bgDiv};
  border-radius :10px;
  padding : 10px 5px 10px 5px;
  cursor : pointer;
  text-transform :uppercase;
  font-weight :bold;
  font-size :small;
`

export default HeaderNav