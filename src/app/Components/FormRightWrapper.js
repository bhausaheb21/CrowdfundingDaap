import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FormState } from './Form';
import { TailSpin } from 'react-loader-spinner';
import axios from 'axios';
import { toast } from 'react-toastify';

const FormRightWrapper = () => {
  const Handler = useContext(FormState);

  const [uploading, setUploading] = useState(false);


  const uploadFiles = async (e) => {
    e.preventDefault();
    setUploading(true);

    // Upload Story to Pinata
    try {

      if (Handler.form.story == "") {
        const error = new Error("Story is Empty")
        throw error;
      }
      const storyResponse = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', { story: Handler.form.story }, {
        headers: {
          'pinata_api_key':"f74fed144059e30e5309",
          'pinata_secret_api_key': "aeff67592e3133d7a6b2bbd5cfab1d58232271e5b3ac04f1acdfee01c0210aae",
          'Content-Type': 'application/json',
        },
      });

      Handler.setStoryUrl(storyResponse.data.IpfsHash);
      console.log(storyResponse.data.IpfsHash);

    } catch (error) {
      // console.error('Error uploading story:', error);

      toast.error(error.message);
    }

    // Upload Image to Pinata
    if (Handler.image !== null) {
      try {
        const imageData = new FormData();
        imageData.append('file', Handler.image);

        const imageResponse = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imageData, {
          headers: {
            'pinata_api_key':"f74fed144059e30e5309",
            'pinata_secret_api_key': "aeff67592e3133d7a6b2bbd5cfab1d58232271e5b3ac04f1acdfee01c0210aae",
            'Content-Type': 'multipart/form-data',
          },
        });

        Handler.setimgUrl(imageResponse.data.IpfsHash);
        console.log(imageResponse.data.IpfsHash);

        Handler.setUploaded(true);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Error uploading image:', error);
        // toast.warn('Error uploading image');
      }
    }
    else {
      toast.error("Image not Picked")
    }

    setUploading(false);
  };

  return (
    <FormRight>
      <FormInput>
        <FormRow>
          <RowFirstInput>
            <label>Required Amount</label>
            <Input
              type="number"
              placeholder="Required Amount"
              name="requiredAmount"
              onChange={Handler.formHandler}
              value={Handler.form.requiredAmount}
            />
          </RowFirstInput>
          <RowSecondInput>
            <label>Choose Category</label>
            <Select onChange={Handler.formHandler} value={Handler.form.category} name='category'>
              <option value="education">Education</option>
              <option value="health">Health</option>
              <option value="animal">Animal</option>
            </Select>
          </RowSecondInput>
        </FormRow>
      </FormInput>
      <FormInput>
        <label>Select Image</label>
        <Image type="file" accept="image/*" onChange={Handler.imageHandler} />
      </FormInput>
      {uploading ? (
        <Button><TailSpin color="#fff" height={20} /></Button>
      ) : !Handler.uploaded ? (
        <Button onClick={uploadFiles}>Upload to IPFS</Button>
      ) : (
        <Button style={{ cursor: 'no-drop' }}>Files Uploaded Successfully</Button>
      )}
      <Button onClick={Handler.startCampaign}>Start Campaign</Button>
    </FormRight>
  );
};

const FormRight = styled.div`
  width: 45%;
`;

const FormInput = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'poppins';
  margin-top: 10px;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const Input = styled.input`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const RowFirstInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const RowSecondInput = styled.div`
  display: flex;
  flex-direction: column;
  width: 45%;
`;

const Select = styled.select`
  padding: 15px;
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;
`;

const Image = styled.input`
  background-color: ${(props) => props.theme.bgDiv};
  color: ${(props) => props.theme.color};
  margin-top: 4px;
  border: none;
  border-radius: 8px;
  outline: none;
  font-size: large;
  width: 100%;

  &::-webkit-file-upload-button {
    padding: 15px;
    background-color: ${(props) => props.theme.bgSubDiv};
    color: ${(props) => props.theme.color};
    outline: none;
    border: none;
    font-weight: bold;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 15px;
  color: white;
  background-color: #00b712;
  background-image: linear-gradient(180deg, #00b712 0%, #5aff15 80%);
  border: none;
  margin-top: 30px;
  cursor: pointer;
  font-weight: bold;
  font-size: large;
`;

export default FormRightWrapper;
