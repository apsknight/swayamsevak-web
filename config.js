export default {
    app: {
        token: "f4e4e00ad6364e9f93ff90dd35d30f33", // <- enter your token here
        muted: false, // <- mute microphone by default
        googleIt: true // <- ask users to google their request, in case of input.unknown action
    },
    locale: {
        strings: {
            welcomeTitle: "Hello, ask something to get started",
            welcomeDescription: `You can type "Hello" for example. Or just press on the microphone to talk`,
            offlineTitle: "Oh, no!",
            offlineDescription: "It looks like you are not connected to the internet, this webpage requires internet connection, to process your requests",
            queryTitle: "Ask me something...",
            voiceTitle: "Go ahead, im listening..."
        },
        settings: {
            speechLang: "en-GB", // <- output language
            recognitionLang: "en-US" // <- input(recognition) language
        }
    }
}