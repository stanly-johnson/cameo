import React, { Component } from 'react';
import { Button, Jumbotron, Container, InputGroup, FormControl } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";
import logo from "./logo.png";
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
    seed : "", // need to change from default value
    name : "",
    image :"",
    showGreeting : false,
    showProfileImg : false,
    showMainLoader : true,
    showSubLoader : false,
    showDidTab : false
  }

  publishIDXConfig = async() => {
    let definitions = await publishIDXConfig(ceramic);
    return definitions;
  }

  connectToCeramic = (ceramic_url = API_URL) => {
    ceramic = new CeramicClient(ceramic_url);
    this.setState({ ceramic_url });
  }

  genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

  handleGenerateIdentityWallet = async() => {
    this.setState({showSubLoader : true});
    await this.generateIdentityWallet();
    this.setState({showSubLoader : false});
  }

  generateIdentityWallet = async (seed) => {
    // create new did from random seed
    let randomSeed = seed ? seed : this.genRanHex(64);
    let seedBuffer = Buffer.from(randomSeed, 'hex');

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

    console.log(idx.did._id);

    let data = await idx.get('profile');

    console.log(data);

    this.setState({did : idx.did._id})
    if (data){
      this.setState({name : data['name'], showGreeting : true});

      if (data['image']){
        this.setState({image : data['image'], showProfileImg : true});
      }
    }

    // remember user
    window.localStorage.setItem("idx-seed", randomSeed);
    this.setState({seed : randomSeed});

    console.log("Generated Wallet!");
  }

  updateName = async(value, imgurl) => {
    this.setState({showSubLoader : true});
    console.log(`Setting name to ${value}`);
    await idx.set('profile', { name: value, image: imgurl });
    this.setState({name : value})
    console.log("Update Complete!")
    toast.success("Profile Updated!");
    this.setState({showSubLoader : false});
  }

  // handleFile = async (path) => {
  //   console.log(path);
  //   let result = await 
  //   console.log(result);
  //   return;
  // }

  async componentDidMount(){
    this.connectToCeramic();
    let def = await this.publishIDXConfig();
    console.log(def);
    profileID = def.definitions.basicProfile;
    let seed = window.localStorage.getItem("idx-seed");
    if (seed) { await this.generateIdentityWallet(seed); }
    this.setState({showMainLoader : false, showDidTab : true});
    console.log("Initial Setup Complete")
  }

  render() {
  return (
    <div className="App">
      <ToastContainer />
      <Jumbotron>
      <Container>
      <p>Ceramic Network : {this.state.ceramic_url}</p>
      <h1><img src={this.state.showProfileImg ? this.state.image : logo} width="100" height="100" borderRadius="20" resizeMode="cover" overflow='hidden'/></h1>
        
        {this.state && this.state.showMainLoader && (
              <div>
                <Loader type="ThreeDots" color="#3f51b5" height="20" width="30"/>
                <small>Loading network configs..</small>
              </div>
      )}
      </Container>
      </Jumbotron>

      {this.state && this.state.showGreeting && (
        <p>Hi, {this.state.name}</p>
      )}
      
      {this.state && this.state.showDidTab && (
        <div>
        <small>Your DID : {this.state.did ? this.state.did.substring(0,15) + "..." + this.state.did.slice(this.state.did.length - 5) : "No DID found"}</small>
        <hr/>
        </div>
      )}
      

      {this.state && this.state.showDidTab && !this.state.did && (
        <Button type="submit" onClick={() => this.handleGenerateIdentityWallet()}>Create a new DID wallet</Button>
      )}
      
      {this.state && this.state.did && (
        <div>
        <h4>Your Profile</h4>
        {this.state && this.state.showSubLoader && (
              <div>
                <Loader type="ThreeDots" color="#3f51b5" height="20" width="30"/>
                <small>Processing..</small>
              </div>
        )}
        <hr />
        
        <p>Name : <input value={this.state.name} onChange={e => this.setState({name : e.target.value})}/></p>
        
        <p>Image : <input value={this.state.image} onChange={e => this.setState({image : e.target.value})}/></p>
        
        <br />
        <Button class="primary" onClick={() => this.updateName(this.state.name, this.state.image)}>Update Profile</Button>
        </div>
      )}

      <br/><br/>

    </div>
  );
  }

}

export default App;
