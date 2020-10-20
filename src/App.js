import React, { Component } from 'react';
import "./App.css";
import { publishIDXConfig, schemas, createDefinition } from '@ceramicstudio/idx-tools';
import { IDX } from '@ceramicstudio/idx';
import CeramicClient from '@ceramicnetwork/ceramic-http-client'
import IdentityWallet from 'identity-wallet'
const API_URL = "http://localhost:7007";
var ceramic = "";
var profileID = "";

class App extends Component {

  state = {
    idw : "",
    ceramic_url : "",
    did : "",
    seed : "06be7d9853096fca06d6da9268a8a66ecaab2a7249ccd63c70fead97aafefa02" // need to change from default value
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
    const idx = new IDX({ ceramic, definitions: { profile: profileID } });

    console.log(idx);

    // const defId = await createDefinition(ceramic, {
    //   name : 'app:profile',
    //   schema : schemas.BasicProfile
    // });

    console.log(idx.did._id);

    // console.log(defId);

    console.log("Setting name");

    //await idx.set('profile', { name: 'Stanly' });

    //let d = await idx.get('profile');

    //console.log(d);

    console.log("done");

    this.setState({did : idx.did._id})


  }

  async componentDidMount(){
    this.connectToCeramic();
    let def = await this.publishIDXConfig();
    console.log(def);
    profileID = def.definitions.basicProfile;
    console.log("Initial Setup Complete")
  }

  render() {
  return (
    <div className="App">
      <p>Ceramic Network URL : {this.state.ceramic_url}</p>
      <h1>DID Wallet</h1>

      <p>Connected DID : {this.state.did}</p>

      <button onClick={() => this.generateIdentityWallet()}>Create a new DID wallet</button>
      <input value={this.state.seed} onChange={e => this.setState({seed : e.target.value})}/>

    </div>
  );
  }

}

export default App;
