let IDX = require('@ceramicstudio/idx').IDX;
let definitions = require('./app-definitions').definitions
let ceramic = require('@ceramicnetwork/ceramic-common')

const test = async () => {

// A first user (Alice) can set her profile on her IDX Document using the definition alias used by the app
const aliceIndex = new IDX({ ceramic, definitions })
await aliceIndex.set('profile', { name: 'Alice' })

// Other users (such as Bob) can read from known Indexes using the same definion alias and Alice's DID
const bobClient = new IDX({ ceramic, definitions })
const aliceProfile = await bobClient.get('profile', aliceIndex.id)

console.log(aliceProfile);

}

test()