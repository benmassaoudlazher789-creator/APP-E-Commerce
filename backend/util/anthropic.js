const Anthropic = require("@anthropic-ai/sdk");

//instanciation paresseuse : si ANTHROPIC_API_KEY n'est pas configuree, le serveur
//doit quand meme demarrer normalement (seule la route generate-description echouera)
let anthropic = null;
const getAnthropicClient = () => {
    if (!anthropic) {
        anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    }
    return anthropic;
};

module.exports = getAnthropicClient;
