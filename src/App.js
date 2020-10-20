import React, { Component } from 'react';
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from 'react-loader-spinner';
import { publishIDXConfig, schemas, createDefinition } from '@ceramicstudio/idx-tools';
import { IDX } from '@ceramicstudio/idx';
import CeramicClient from '@ceramicnetwork/ceramic-http-client'
import IdentityWallet from 'identity-wallet'
const API_URL = "http://localhost:7007";
var ceramic = "";
var profileID = "";
var idx = "";

class App extends Component {

  state = {
    idw : "",
    ceramic_url : "",
    did : "",
    seed : "06be7d9853096fca06d6da9268a8a66ecaab2a7249ccd63c70fead97aafefa01", // need to change from default value
    name : "",
    showMainLoader : true,
    showSubLoader : false
  }

  publishIDXConfig = async() => {
    let definitions = await publishIDXConfig(ceramic);
    return definitions;
  }

  connectToCeramic = (ceramic_url = API_URL) => {
    ceramic = new CeramicClient(ceramic_url);
    this.setState({ ceramic_url });
  }

  generateIdentityWallet = async () => {
    if (this.state.seed === undefined){
      return;
    }
    //convert seed to uint8array
    // test with 06be7d9853096fca06d6da9268a8a66ecaab2a7249ccd63c70fead97aafefa02
    let seedBuffer = Buffer.from(this.state.seed, 'hex');

    let idw = await IdentityWallet.create({
      getPermission: async () => [],
      seed : seedBuffer
    });

    console.log(idw);
    // set the provider to ceramic
    await ceramic.setDIDProvider(idw.getDidProvider());

    console.log(profileID);
    idx = new IDX({ ceramic, definitions: { profile: profileID } });

    console.log(idx);
    // const defId = await createDefinition(ceramic, {
    //   name : 'app:profile',
    //   schema : schemas.BasicProfile
    // });

    console.log(idx.did._id);

    let data = await idx.get('profile');

    console.log(data);

    this.setState({did : idx.did._id})
    if (data){
      this.setState({name : data['name']})
    }

    console.log("done");
  }

  updateName = async(value) => {
    this.setState({showSubLoader : true});
    console.log(`Setting name to ${value}`);
    await idx.set('profile', { name: value });
    this.setState({name : value})
    console.log("Update Complete!")
    toast.success("Profile Updated!");
    this.setState({showSubLoader : false});
  }

  async componentDidMount(){
    this.connectToCeramic();
    let def = await this.publishIDXConfig();
    console.log(def);
    profileID = def.definitions.basicProfile;
    this.setState({showMainLoader : false});
    console.log("Initial Setup Complete")
  }

  render() {
  return (
    <div className="App">
      <ToastContainer />
      <p>Ceramic Network : {this.state.ceramic_url}</p>
      <h3>Ceramic DID Wallet</h3>
      {this.state && this.state.showMainLoader && (
              <div>
                <Loader type="ThreeDots" color="#3f51b5" height="20" width="30"/>
                <small>Loading network configs..</small>
              </div>
      )}

      <p>Connected DID : {this.state.did}</p>

      <button onClick={() => this.generateIdentityWallet()}>Create a new DID wallet</button>
      <input value={this.state.seed} onChange={e => this.setState({seed : e.target.value})}/>

      {this.state && this.state.did && (
        <div>
        <h3>Profile Details</h3>
        {this.state && this.state.showSubLoader && (
              <div>
                <Loader type="ThreeDots" color="#3f51b5" height="20" width="30"/>
                <small>Processing..</small>
              </div>
        )}
        <p>Name : <input value={this.state.name} onChange={e => this.setState({name : e.target.value})}/></p>
        <button onClick={() => this.updateName(this.state.name)}>Update Profile</button>
        </div>
      )}

    </div>
  );
  }

}

export default App;
