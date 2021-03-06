export default {
    app: {
        token: "f4e4e00ad6364e9f93ff90dd35d30f33", // <- enter your token here
        muted: true, // <- mute microphone by default
        googleIt: true // <- ask users to google their request, in case of input.unknown action
    },
    locale: {
        strings: {
            welcomeTitle: "Welcome to SwayamSevak! You are at IIT Hospital.",
            welcomeDescription: `You can type "Hello" for example. Or just press on the microphone to talk`,
            offlineTitle: "Oh, no!",
            offlineDescription: "It looks like you are disconnected from our WiFi. Please connect to facility WiFi to continue.",
            queryTitle: "Ask me something...",
            voiceTitle: "Go ahead, Swayamsevak is listening..."
        },
        settings: {
            speechLang: "en-GB", // <- output language
            recognitionLang: "en-US" // <- input(recognition) language
        }
    }
}