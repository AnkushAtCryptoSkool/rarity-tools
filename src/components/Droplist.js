import React from 'react'
import contract from '../contracts/contract.json'
import { Helmet } from "react-helmet"
// import Web3 from 'web3';
import Web3 from 'https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.0/web3.min.js';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import "../styles/styles.css";
// console.log(contract);
const initialInfo = {
  connected: false,
  status: null,
  account: null,
  contract: null
}

const initialDropState = {
  loading: false,
  list: []
}

const Droplist = () => {

const [info, setinfo] = useState(initialInfo);
const [drops, setdrops] = useState(initialDropState);
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm();

const init = async () => {
  console.log("This worked");
  if(window.ethereum?.isMetaMask) {
    // console.log(":", window.ethereum)
    const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
    });
    console.log(accounts);
    const networkId =  await window.ethereum.request({
      method: "net_version",
});
console.log(networkId);

  if(networkId == 4)
  {console.log("sssssssssssd");
    // let web3 = new Web3(window.ethereum);
    console.log("sd");
    // setinfo({...initialInfo, connected: true, account:accounts[0] ,contract: new web3.eth.Contract(contract.abi, contract.address)});
  }
  else{
    setinfo({...initialInfo, status:"You need to be rinkeby testnet...."});
    }

  }
  else {
    setinfo({...initialInfo, status:"You need metamask...."});
    console.log("You need metamask");
  }

};

const getDrops = () => {
  setdrops((prevState) => ({
    ...prevState,
    loading: true

  }))
  contract.methods.drops.call().then((res) =>{
    console.log(res);
    setdrops({
      loading: false,
      list: res
    });
  }).catch((err) => {
    console.log(err);
    setdrops(initialDropState);
  });
}
const onSubmit = (data) => {
  let newData = {
    imageUri: data.imageUri,
    name: data.name,
    description: data.description,
    social1: data.social1,
    social2: data.social2,
    websiteUri: data.websiteUri,
    price: Number(data.price),
    supply: Number(data.supply),
    presale: Number(data.presale),
    chain: Number(data.chain),
    approved: false
  };
  // console.log(Object.values(newData));
  info.contract.methods.addDrop(Object.values(newData)).send({from: info.account}).then((res) =>{
    console.log(res);
  }).catch((err) => {
    console.log(err);
 
   });
};

  useEffect(() => {
      init();
      initOnchanged();
      }, []);
   useEffect(() => {
    if(info.contract){
      getDrops();
    }
   },[info])   

const initOnchanged = () => {
  if(window.ethereum)
  {
    window.ethereum.on("accountsChanged", () => {
      window.location.reload();
      // console.log("sd");
    });
    window.ethereum.on("chainChanged", () => {
      window.location.reload();
    })



  }
}
      return (
        <div> 

  <div className="header">
    <h3>NFT PROJECTO</h3>
  </div>
  <div className="content">
<Tabs>
    <TabList>
      <Tab>Title 1</Tab>
      <Tab>Title 2</Tab>
    </TabList>

    <TabPanel>
      <h2>Any content 1</h2>
      <button onClick={() => getDrops()}>Get Drop</button>
      <div style={{height:50}}></div>
        {drops.loading ? <p>Loading...</p> : null}
        {
          drops.list.map(item => {
            return (
              <div className='dropContainer'>
                  <div>
                  <p className='dropText'>name: {item.name}</p>
                  <p className='dropText'>description: {item.description}</p>
                  <div style={{height:20}}></div>
                  <img className={"dropimage"}
                    alt={"drop.image"}
                    src={item.imageUrl} 
                  />
                  </div>
             <div>
             <p className='dropText'>Twitter: {item.social1}</p>
             <p className='dropText'>Discord: {item.social2}</p>
             </div>
               <div> 
                <p className='dropText'>Total supply: {item.supply}</p>
                <p className='dropText'>Sale date: {item.sale}</p>
                <p className='dropText'>Presale date: {item.presale}</p>
              </div>
              </div>
            );
          })
        } 
  
  
    </TabPanel>
    <TabPanel>
      <h2>Any content 2</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
      <label>Image Url</label>
      <input {...register('imageUri')} />
      <br />
      <br />
      <label>Name</label>
      <input {...register('name')} />
      <br />
      <br />
      <label>Description</label>
      <input {...register('description')} />
      <br />
      <br />
      <label>Twitter</label>
      <input {...register('social1')} />
      <br />
      <br />
      <label>Discord</label>
      <input {...register('social2')} />
      <br />
      <br />
      <label>Website Url</label>
      <input {...register('websiteUri')} />
      <br />
      <br />
      <label>Price</label>
      <input {...register('price')} />
      <br />
      <br />
      <label>Supply</label>
      <input {...register('supply')} />
      <br />
      <br />
      <label>Presale</label>
      <input {...register('presale')} />
      <br />
      <br />
      <label>Chain</label>
      <input {...register('chain')} />
      <br />
      <br />

      <input {...register('lastName', { required: true })} />
      {errors.lastName && <p>Last name is required.</p>}
      <input {...register('age', { pattern: /\d+/ })} />
      {errors.age && <p>Please enter number for age.</p>}
     
      <input type="submit" />
    </form>
  
    </TabPanel>
  </Tabs>
  </div>
  
      </div>
      );
};

export default Droplist;