"use client"

import { ethers } from 'ethers';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import CampaignFactory from '../../../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import Campaign from '../../../../artifacts/contracts/Campaign.sol/Campaign.json'
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

function Details() {
  const { address } = useParams()
  const [campaign, setCampaign] = useState({})
  const [loading, setloading] = useState(false)
  const [mydonations, setMydonations] = useState([]);
  const [alldonations, setAllDonations] = useState([]);
  // const [story, setStoryUrl] = useState();
  const [amount, setAmount] = useState();
  const [change, setchange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setloading(true)
      try {

        const provider = new ethers.providers.JsonRpcProvider(
          process.env.NEXT_PUBLIC_RPC_URL
        );

        const contract = new ethers.Contract(
          address,
          Campaign.abi,
          provider
        );

        const title = await contract.title();
        const requiredAmount = await contract.required_amt();
        const image = await contract.image();
        const storyUrl = await contract.story();
        const owner = await contract.owner();
        const receivedAmount = await contract.received_amt();
        const data = await axios.get('https://red-secret-rodent-578.mypinata.cloud/ipfs/' + storyUrl)

        setCampaign({
          address: address,
          title,
          requiredAmount: ethers.utils.formatEther(requiredAmount),
          image,
          receivedAmount: ethers.utils.formatEther(receivedAmount),
          story: data.data.story,
          owner,
        })

        const Donations = contract.filters.donated();
        const AllDonations = await contract.queryFilter(Donations);


        const AllDonationsData = AllDonations.map((e) => {
          return {
            donor: e.args.donor,
            amount: ethers.utils.formatEther(e.args.amount),
            timestamp: parseInt(e.args.timestamp)
          }
        });
        setAllDonations(AllDonationsData);

        await window.ethereum.request({ method: 'eth_requestAccounts' });

        // Create a Web3 provider and signer
        const provider1 = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider1.getSigner();
        const userAddress = await signer.getAddress();


        const myDonationsFilter = contract.filters.donated(userAddress);
        const donationEvents = await contract.queryFilter(myDonationsFilter);

        const formattedDonations = donationEvents.map((event) => {
          return {
            donor: event.args.donor,
            amount: ethers.utils.formatEther(event.args.amount),
            timestamp: new Date(event.args.timestamp.toNumber() * 1000).toLocaleString(),
          }
        });
        setMydonations(formattedDonations)
        // toast.success("Reco")
        // toast.success("Record fetched successfully")
      }
      catch (err) {
        toast.error(err.message)
      }
      setloading(false)
    }

    fetchData()
  }, [address])

  const DonateFunds = async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(address, Campaign.abi, signer);
      const transaction = await contract.donate({
        value: ethers.utils.parseEther(amount),
        gasLimit: 30000,
      });
      await transaction.wait();
      setChange(!change);
      setAmount('');
      toast.success("Transaction Succeded")

    } catch (error) {
      toast.error("Transaction Failed")
    }
  }

  return (
    (loading) ?
      <Spinner>
        <TailSpin height={60} />
      </Spinner>
      :
      <DetailWrapper>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <LeftContainer>
          <ImageSection>
            <Image
              fill
              alt="Loading image"
              src={`https://gateway.pinata.cloud/ipfs/${campaign.image}`} />
          </ImageSection>
          <Text>
            {campaign.story}
          </Text>
        </LeftContainer>
        <RightContainer>
          <Title>{campaign.title}</Title>
          <DonateSection>
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Enter Amount to Donate" />
            <Donate onClick={DonateFunds}>Donate</Donate>
          </DonateSection>
          <FundsData>
            <Funds>
              <FundText key={1}>Required Amount</FundText>
              <FundText key={2}>{campaign.requiredAmount} Matic</FundText>
            </Funds>
            <Funds>
              <FundText key={3}>Received Amount</FundText>
              <FundText key={4}>{campaign.receivedAmount} Matic</FundText>
            </Funds>
          </FundsData>

          <Donated>
            <LiveDonation>
              <DonationTitle>Recent Donations</DonationTitle>
              {
                alldonations.map((e, index) => {
                  return <Donation key={index}>
                    <DonationData key={index}>{e.donor.slice(0, 6)}...{e.donor.slice(39)}</DonationData>
                    <DonationData key={index}>{e.amount} Matic</DonationData>
                    <DonationData key={index}>{new Date(e.timeStamp * 1000).toLocaleString()}</DonationData>
                  </Donation>
                })
              }
            </LiveDonation>
            <MyDonation>
              <DonationTitle>My Past Donations</DonationTitle>
              {mydonations.map((e, index) => {
                return <Donation key={index}>
                  <DonationData key={index}>{e.donor.slice(0, 6)}...{e.donor.slice(39)}</DonationData>
                  <DonationData key={index}>{e.amount} Matic</DonationData>
                  <DonationData key={index}>{new Date(e.timeStamp * 1000).toLocaleString()}</DonationData>
                </Donation>
              })
              }
            </MyDonation>
          </Donated>

        </RightContainer>
      </DetailWrapper>
  )
}

const Spinner = styled.div`
    width:100%;
    height:90vh;
    display:flex ;
    justify-content:center ;
    align-items:center ;
`
const DetailWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  width: 98%;
`;
const LeftContainer = styled.div`
  width: 45%;
`;
const RightContainer = styled.div`
  width: 50%;
`;
const ImageSection = styled.div`
  width: 100%;
  position: relative;
  height: 350px;
`;
const Text = styled.p`
  font-family: "Roboto";
  font-size: large;
  color: ${(props) => props.theme.color};
  text-align: justify;
`;
const Title = styled.h1`
  padding: 0;
  margin: 0;
  font-family: "Poppins";
  font-size: x-large;
  color: ${(props) => props.theme.color};
`;
const DonateSection = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const Input = styled.input`
  padding: 8px 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 40%;
  height: 40px;
`;
const Donate = styled.button`
  display: flex;
  justify-content: center;
  width: 40%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  cursor: pointer;
  font-weight: bold;
  border-radius: 8px;
  font-size: large;
`;
const FundsData = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;
const Funds = styled.div`
  width: 45%;
  background-color: ${(props) => props.theme.bgDiv};
  padding: 8px;
  border-radius: 8px;
  text-align: center;
`;
const FundText = styled.p`
  margin: 2px;
  padding: 0;
  font-family: "Poppins";
  font-size: normal;
`;
const Donated = styled.div`
  height: 280px;
  margin-top: 15px;
  background-color: ${(props) => props.theme.bgDiv};
`;
const LiveDonation = styled.div`
  height: 65%;
  overflow-y: auto;
`;
const MyDonation = styled.div`
  height: 35%;
  overflow-y: auto;
`;
const DonationTitle = styled.div`
  font-family: "Roboto";
  font-size: x-small;
  text-transform: uppercase;
  padding: 4px;
  text-align: center;
  background-color: #4cd137;
`;
const Donation = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  background-color: ${(props) => props.theme.bgSubDiv};
  padding: 4px 8px;
`;
const DonationData = styled.p`
  color: ${(props) => props.theme.color};
  font-family: "Roboto";
  font-size: large;
  margin: 0;
  padding: 0;
`;

export default Details
