"use client"
import React, { createContext, useState } from 'react'
import FormLeftWrapper from './FormLeftWrapper'
import FormRightWrapper from './FormRightWrapper'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { TailSpin } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import CampaignFactory from '../../../artifacts/contracts/Campaign.sol/CampaignFactory.json'
import { useRouter } from 'next/navigation'

export const FormState = createContext();

const Form = () => {

    const router = useRouter()

    const [form, setform] = useState({
        campaignTitle: "",
        story: "",
        requiredAmount: "",
        category: "education"
    })

    const [loading, setLoading] = useState(false);
    const [address, setaddress] = useState("");

    const [image, setimage] = useState(null);
    const [storyurl, setStoryUrl] = useState(null);
    const [imgurl, setimgUrl] = useState(null);
    const [uploaded, setUploaded] = useState(false);

    const imageHandler = (e) => {
        setimage(e.target.files[0]);
    }

    const formHandler = (e) => {
        setform({
            ...form,
            [e.target.name]: e.target.value
        })
    }

    const startCampaign = async (e) => {
        e.preventDefault();
        console.log("Campaign Creation started");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        if (form.campaignTitle === "")
            toast.warn('Title Field is empty')
        else if (form.story === "")
            toast.warn('Story Field is empty')
        else if (form.requiredAmount === "")
            toast.warn('Required Amount is empty')
        else if (uploaded === false)
            toast.warn('Files are required')
        else {
            setLoading(true);


            try {

                const contract = new ethers.Contract(
                    process.env.NEXT_PUBLIC_ADDRESS,
                    CampaignFactory.abi,
                    signer
                )

                console.log("Contract");

                const CampaignAmount = ethers.utils.parseEther(form.requiredAmount);

                const campaignData = await contract.createCampaign(
                    form.campaignTitle,
                    CampaignAmount,
                    imgurl,
                    storyurl,
                    form.category
                );

                console.log(form.category);
                

                console.log("Contract 1");
                await campaignData.wait();

                setaddress(campaignData.to)

                toast.success("Campaign Created Successfully");
            } catch(err){
                toast.error("Network error Occured")
            }
        }
    }

    return (
        <FormState.Provider value={{ uploaded, setUploaded, form, setform, image, setimage, imageHandler, formHandler, setStoryUrl, setimgUrl, setLoading, setaddress, startCampaign }}>
            <FormWrapper>
                <FormMain>
                    {loading ?
                        address == "" ?
                            <Address>
                                <Spinner>
                                    <TailSpin height={60} />
                                </Spinner>
                            </Address> : <Address>
                                <h1> Campaign Started Successfully</h1>

                                <h2 style={{ marginTop: 15 }}>{address}</h2>
                                <Button onClick={()=>{
                                    router.push("/")
                                }}>
                                    Go to Campaign
                                </Button>
                            </Address>
                        :
                        <FormInputsWrapper>
                            <FormLeftWrapper />
                            <FormRightWrapper />
                        </FormInputsWrapper>
                    }
                </FormMain>
            </FormWrapper>
        </FormState.Provider>
    )
}

const FormWrapper = styled.div`
    width: 100%;
    display:flex;
    justify-content:center;
`

const FormMain = styled.div`
    width:90%;
`

const FormInputsWrapper = styled.div`
    display:flex;
    justify-content:space-between ;
    margin-top:45px ;
    width : 80%

`

const Spinner = styled.div`
    width:100%;
    height:80vh;
    display:flex ;
    justify-content:center ;
    align-items:center ;
`
const Address = styled.div`
    width:100%;
    height:80vh;
    display:flex ;
    display:flex ;
    flex-direction:column;
    align-items:center ;
    background-color:${(props) => props.theme.bgSubDiv} ;
    border-radius:8px;
`

const Button = styled.button`
  display: flex;
  justify-content:center;
  width:30% ;
  padding:15px ;
  color:white ;
  background-color:#00b712 ;
  background-image:
  linear-gradient(180deg, #00b712 0%, #5aff15 80%) ;
  border:none;
  margin-top:30px ;
  cursor: pointer;
  font-weight:bold ;
  font-size:large ;
`

export default Form
