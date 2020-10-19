// Testing library working
import { publishIDXConfig } from '@ceramicstudio/idx-tools'

// First we need to make sure the IDX config (definitions and schemas) are published on the Ceramic node
// Here `ceramic` implements the CeramicApi interface
const { definitions } = await publishIDXConfig(ceramic)

const appDefinitions = {
  profile: definitions.basicProfile
}

