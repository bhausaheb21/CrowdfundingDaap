// import { useRouter } from "next/router";
"use client";
import { AccountBox, Event, FilterAlt, Paid } from "@mui/icons-material";
import styled from "styled-components";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { ethers } from "hardhat";
const CampaignFactory = require("../../artifacts/contracts/Campaign.sol/CampaignFactory.json");
const Campaign = require("../../artifacts/contracts/Campaign.sol/Campaign.json");
const { ethers } = require("ethers");



export default function Layout({ children }) {

  const [allCampaigns, setAllCampaigns] = useState([])
  const [healthCampaigns, sethealthCampaigns] = useState([])
  const [animalCampaigns, setanimalCampaigns] = useState([])
  const [educationCampaigns, seteducationCampaigns] = useState([])
  const Router = useRouter()

  const [displayCampaigns, setdisplayCampaigns] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {

    const provider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_RPC_URL
    );

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_ADDRESS,
      CampaignFactory.abi,
      provider
    );

    //all
    const getAllCampaigns = contract.filters.CampaignCreated(null, null, null, null, null, null, null);
    let allcampaigns = await contract.queryFilter(getAllCampaigns);
    let alldata = allcampaigns.reverse().map((e) => {
      return {
        title: e.args.title,
        image: e.args.imgURI,
        owner: e.args.owner,
        address: e.args.campaignAddress.toString(),
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.required_amt)
      }

    });
    setdisplayCampaigns(alldata)
    setAllCampaigns(alldata)

    // health
    const gethealthCampaigns = contract.filters.CampaignCreated(null, null, null, null, 'health', null, null);
    let healthcampaigns = await contract.queryFilter(gethealthCampaigns);
    let healthdata = healthcampaigns.reverse().map((e) => {
      return {
        title: e.args.title,
        image: e.args.imgURI,
        owner: e.args.owner,
        address: e.args.campaignAddress.toString(),
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.required_amt)
      }

    });
    sethealthCampaigns(healthdata)

    //education
    const geteducationCampaigns = contract.filters.CampaignCreated(null, null, null, null, 'education', null, null);
    let educationcampaigns = await contract.queryFilter(geteducationCampaigns);
    let educationdata = educationcampaigns.reverse().map((e) => {
      return {
        title: e.args.title,
        image: e.args.imgURI,
        owner: e.args.owner,
        address: e.args.campaignAddress.toString(),
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.required_amt)
      }

    });
    seteducationCampaigns(educationdata)

    //animal
    const getanimalCampaigns = contract.filters.CampaignCreated(null, null, null, null, 'animal', null, null);
    let animalcampaigns = await contract.queryFilter(getanimalCampaigns);
    let animaldata = animalcampaigns.reverse().map((e) => {
      return {
        title: e.args.title,
        image: e.args.imgURI,
        owner: e.args.owner,
        address: e.args.campaignAddress.toString(),
        timeStamp: parseInt(e.args.timestamp),
        amount: ethers.utils.formatEther(e.args.required_amt)
      }

    });
    setanimalCampaigns(animaldata)
  }
  return (
    <HomeWrapper>
      <FilterWrapper>
        <FilterAlt style={{ fontSize: 40 }} />
        <Category onClick={() => { setdisplayCampaigns(allCampaigns) }}>All</Category>
        <Category onClick={() => { setdisplayCampaigns(healthCampaigns) }}>Health</Category>
        <Category onClick={() => { setdisplayCampaigns(educationCampaigns) }}>Education</Category>
        <Category onClick={() => { setdisplayCampaigns(animalCampaigns) }}>Animal</Category>
      </FilterWrapper>

      <CardsWrapper>
        {displayCampaigns.map((e, index) => {
          return <Card key={index}>
            <CardImg>
              <Image
                fill
                alt="Failed to load Image"
                src={`https://gateway.pinata.cloud/ipfs/${e.image}`} />
            </CardImg>
            <Title>{e.title}</Title>
            <CardData>
              <Text>Owner<AccountBox /></Text>
              <Text>{e.owner.slice(0, 6)}...{e.owner.slice(39)}</Text>
            </CardData>
            <CardData>
              <Text>Amount <Paid /></Text>
              <Text>{e.amount} Matic</Text>
            </CardData>
            <CardData>
              <Text><Event /></Text>
              <Text>{new Date(e.timeStamp * 1000).toLocaleString()}</Text>
            </CardData>
            <Button onClick={() => { Router.push(`/details/${e.address}`) }}>Go to Campaign</Button>
          </Card>
        })}
      </CardsWrapper>
    </HomeWrapper>
  );
}


const HomeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`
const FilterWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 80%;
  margin-top: 15px;
`
const Category = styled.div`
  padding: 10px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  margin: 0px 15px;
  border-radius: 8px;
  font-family: 'Poppins';
  font-weight: normal;
  cursor: pointer;
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
  background-color:'voilet' ;
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