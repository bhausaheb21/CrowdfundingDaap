"use client";
import styled from 'styled-components';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PaidIcon from '@mui/icons-material/Paid';
import EventIcon from '@mui/icons-material/Event';
import Image from 'next/image';
import { ethers } from 'ethers';
import CampaignFactory from '../../../artifacts/contracts/Campaign.sol/CampaignFactory.json';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { TailSpin } from 'react-loader-spinner';

export default function Dashboard() {
  const [campaignsData, setCampaignsData] = useState([]);
  const [loading, setloading] = useState(false)

  useEffect(() => {
    const Request = async () => {
      setloading(true)
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const Web3provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = Web3provider.getSigner();
      const Address = await signer.getAddress();

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_RPC_URL
      );

      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_ADDRESS,
        CampaignFactory.abi,
        provider
      );

      const getAllCampaigns = contract.filters.CampaignCreated(null, null, Address);
      const AllCampaigns = await contract.queryFilter(getAllCampaigns);
      const AllData = AllCampaigns.map((e) => {
        return {
          title: e.args.title,
          image: e.args.imgURI,
          owner: e.args.owner,
          address: e.args.campaignAddress.toString(),
          timeStamp: parseInt(e.args.timestamp),
          amount: ethers.utils.formatEther(e.args.required_amt)
        }
      })
      setCampaignsData(AllData)
      setloading(false)
    }
    Request();
  }, [])

  return (
    loading ?
      <Spinner>
        <TailSpin height={60} />
      </Spinner>
      : <HomeWrapper>

        {/* Cards Container */}
        <CardsWrapper>

          {/* Card */}
          {campaignsData.map((e, index) => {
            return (
              <Card key={index}>
                <CardImg>
                  <Image
                    alt="Loading Image"
                    layout='fill'
                    src={"https://gateway.pinata.cloud/ipfs/" + e.image}
                  />
                </CardImg>
                <Title>
                  {e.title}
                </Title>
                <CardData>
                  <Text>Owner<AccountBoxIcon /></Text>
                  <Text>{e.owner.slice(0, 6)}...{e.owner.slice(39)}</Text>
                </CardData>
                <CardData>
                  <Text>Amount<PaidIcon /></Text>
                  <Text>{e.amount} Matic</Text>
                </CardData>
                <CardData>
                  <Text><EventIcon /></Text>
                  <Text>{new Date(e.timeStamp * 1000).toLocaleString()}</Text>
                </CardData>
                <Link passHref href={'/details/' + e.address}><Button>
                  Go to Campaign
                </Button></Link>
              </Card>
            )
          })}
          {/* Card */}

        </CardsWrapper>
      </HomeWrapper>
  )
}

const Spinner = styled.div`
    width:100%;
    height:90vh;
    display:flex ;
    justify-content:center ;
    align-items:center ;
`

const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const CardsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 80%;
  margin-top: 25px;
`
const Card = styled.div`
  width: 30%;
  margin-top: 20px;
  background-color: ${(props) => props.theme.bgDiv};

  &:hover{
    transform: translateY(-10px);
    transition: transform 0.5s;
  }
  
  &:not(:hover){
    transition: transform 0.5s;
  }
`
const CardImg = styled.div`
  position: relative;
  height: 120px;
  width: 100%;
`
const Title = styled.h2`
  font-family: 'Roboto';
  font-size: 18px;
  margin: 2px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 5px;
  cursor: pointer;
  font-weight: normal;
`
const CardData = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 2px 0px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 5px;
  cursor: pointer;
  `
const Text = styled.p`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  font-family: 'Roboto';
  font-size: 18px;
  font-weight: bold;
`
const Button = styled.button`
  padding: 8px;
  text-align: center;
  width: 100%;
  background-color:#00b712 ;
  background-image:
      linear-gradient(180deg, #00b712 0%, #5aff15 80%); 
  border: none;
  cursor: pointer;
  font-family: 'Roboto';
  text-transform: uppercase;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
`