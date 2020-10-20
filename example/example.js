let IDX = require('@ceramicstudio/idx').IDX;
const IdentityWallet = require('identity-wallet').default;
const publishIDXConfig = require('@ceramicstudio/idx-tools').publishIDXConfig;
const CeramicClient = require('@ceramicnetwork/ceramic-http-client').default;
const ceramic = new CeramicClient('http://localhost:7007');
const seed = new Uint8Array([
    6, 190, 125, 152,  83,   9, 111, 202,
    6, 214, 218, 146, 104, 168, 166, 110,
  202, 171,  42, 114,  73, 204, 214,  60,
  112, 254, 173, 151, 170, 254, 250,   2
]);

const test = async () => {

const idw = await IdentityWallet.create({
        getPermission: async () => [],
        seed
      });

await ceramic.setDIDProvider(idw.getDidProvider())

const { definitions } = await publishIDXConfig(ceramic);

const profileID = definitions.basicProfile;

// const idWallet = await IdentityWallet.create({ seed })
// const provider = idWallet.getDidProvider();

console.log("Done")
const idx = new IDX({ ceramic, definitions: { profile: profileID } });

console.log(idx);


//idx.authenticate();

await idx.set('profile', { name: 'Alice' });

//let data = idx.get('profile', idx.getIDXDocID);

let x = await idx.getIDXDocID;

console.log(x.toString());

console.log("Set success!!")

//await idx.get('profile', idx.id);

//console.log("Set Succceded!!");

// const idx = new IDX({ceramic});

// await idx.get();

//await idx.get('did:3:bagcqcera5lkmrw2jiojzfsd3osjh5tv4ld6sxjs4f5wc5krhestl54lmciea');

//idx.authenticate(provider="http://localhost:7007");

// // A first user (Alice) can set her profile on her IDX Document using the definition alias used by the app
// const aliceIndex = new IDX({ ceramic, definitions })
// await aliceIndex.set('profile', { name: 'Alice' })

// // Other users (such as Bob) can read from known Indexes using the same definion alias and Alice's DID
// const bobClient = new IDX({ ceramic, definitions })
// const aliceProfile = await bobClient.get('profile', aliceIndex.id)

//console.log(aliceProfile);

}

test()