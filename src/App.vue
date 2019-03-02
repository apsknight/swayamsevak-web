<template>
<main id="app">

    <!-- The input -->
    <div class="query">
        <div class="wrapper" v-if="micro == false">
            <i class="material-icons iicon" @click="microphone(true)">mic</i>
            <input :aria-label="config.locale.strings.queryTitle" autocomplete="off" v-model="query" class="queryform" @keyup.enter="submit()" :placeholder="config.locale.strings.queryTitle" autofocus type="text">
            <i class="material-icons iicon t2s" @click="mute(true)" v-if="muted == false">volume_up</i>
            <i class="material-icons iicon t2s" @click="mute(false)" v-else>volume_off</i>
        </div>
        <div class="wrapper" v-else>
            <i class="material-icons iicon recording" @click="microphone(false)">mic</i><input class="queryform" :placeholder="speech" readonly>   
        </div>
    </div>

    <section class="wrapper ai-window">

        <br>
        <br>

        <!-- Display Welcome Message -->
        <div v-if="answers.length == 0 && online == true">
            <h1 class="title mdc-typography--headline">

                    {{config.locale.strings.welcomeTitle}}

                    <p class="mdc-typography--body2">{{config.locale.strings.welcomeDescription}}</p>

                <div class="material-icons up">arrow_downward</div>
            </h1>
        </div>

        <!-- Display offline message -->
        <div v-if="answers.length == 0 && online == false">
            <h1 class="title mdc-typography--headline">
                <div class="material-icons up">cloud_off</div>
                <br>
                <br>
                    {{config.locale.strings.offlineTitle}}

                    <p class="mdc-typography--body2">{{config.locale.strings.offlineDescription}}</p>
            </h1>
        </div>

        <!-- Chat window -->
        <table v-for="a in answers" class="chat-window">

            <!-- Your messages -->
            <tr>
                <td class="bubble">{{a.result.resolvedQuery}}</td>
            </tr>

            <!-- Dialogflow messages -->
            <tr>
                <td>

                    <!-- Bot message types / Speech -->

                    <div v-if="a.result.fulfillment.speech && !(a.result.fulfillment.displayText)" class="bubble bot">
                        {{a.result.fulfillment.speech}}
                    </div>

                    <!-- Google Assistant output -->
                    <div v-for="r in a.result.fulfillment.messages">

                        <!-- Bot message types / Card -->

                        <div class="mdc-card" v-if="r.type == 'basic_card'">
                            <section class="mdc-card__primary">
                                <h1 class="mdc-card__title">
                                    {{r.heading}}
                                </h1>
                            </section>
                            <section class="mdc-card__supporting-text">
                                {{r.title1}}
                                <br>
                                {{r.title2}}
                            </section>
                            <section class="mdc-card__actions">
                                <a :href="r.button.uri" target="_blank">
                                    <button class="redirect">{{r.button.title}}<i class="material-icons openlink">open_in_new</i></button></a>
                            </section>
                        </div>

                        <!-- Bot message types / Carousel Card -->

                        <div class="slider" v-if="r.type == 'carousel_card'">
                            <carousel 
                                    :perPage="1" 
                                    :navigationEnabled="true"
                                    :paginationEnabled="false"
                                    navigationNextLabel="<button class='mdc-fab mdc-fab--mini material-icons rightnav'><span class='mdc-fab__icon'>keyboard_arrow_right</span></button>"
                                    navigationPrevLabel="<button class='mdc-fab mdc-fab--mini material-icons leftnav'><span class='mdc-fab__icon'>keyboard_arrow_left</span></button>"
                                    :navigationClickTargetSize="0"
                                    :loop="true">

                                <slide v-for="item in r.items" :key="item.id">
                                    <div class="mdc-card slide">
                                        <img class="mdc-card__media-item" :src="item.image.url" v-if="item.image">
                                        <section class="mdc-card__primary">
                                            <h1 class="mdc-card__title themed" @click="autosubmit(item.optionInfo.key)">{{item.heading}}</h1>
                                            <h2 class="mdc-card__subtitle" v-if="item.status == 1" style="color:green">
                                             Available
                                            </h2>
                                             <h2 class="mdc-card__subtitle" v-if="item.status == 0" style="color:red">
                                             Not Available
                                            </h2>
                                        </section>
                                        <section class="mdc-card__supporting-text">
                                            {{item.title1}}
                                            <br>
                                            {{item.title2}}
                                        </section>
                                    </div>
                                </slide>
                            </carousel>
                        </div>
                        <!-- Brodcast message types / Card -->
                         <div class="mdc-card" v-if="r.type == 'brodcast_card'">
                             <img class="mdc-card__media-item" src="data:image/png;base64,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">
                            <section class="mdc-card__primary">
                                <h1 class="mdc-card__title">
                                    Brodcast
                                </h1>
                            </section>
                            <section class="mdc-card__supporting-text">
                                {{r.message}}
                            </section>
                        </div>


                        <!-- Bot message types / List -->

                        <div class="mdc-list-group mdc-card" v-if="r.type == 'list_card'">
                            <h3 class="mdc-list-group__subheader">{{r.title}}</h3>
                            <ul class="mdc-list mdc-list--two-line mdc-list--avatar-list" v-for="item in r.items" @click="autosubmit(item.optionInfo.key)">
                                <li class="mdc-list-item">
                                    <img :title="item.image.accessibilityText" :alt="item.image.accessibilityText" class="mdc-list-item__start-detail" width="56" height="56" :src="item.image.url" v-if="item.image"/>
                                    <span class="mdc-list-item__text">
                                        {{item.title}}
                                    <span class="mdc-list-item__text__secondary">{{item.description}}</span>
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <!-- Bot message types / Link Chip -->

                        <div v-if="r.type == 'link_out_chip'" class="chips">
                            <a class="suggestion link" :href="r.url" target="_blank">
                                {{r.destinationName}} <i class="material-icons openlink">open_in_new</i>
                            </a>
                        </div>

                        <!-- Bot message types / Suggestion Chip -->

                        <div v-if="r.type == 'suggestion_chips'" class="chips">
                            <div class="suggestion" @click="autosubmit(s.title)" v-for="s in r.suggestions">
                                {{s.title}}
                            </div>
                        </div>

                        <!-- Bot message types / Google Suggestion Chip -->

                        <div v-if="r.unknown == true" class="google-chip chips">
                            <a class="suggestion" :href="'https://www.google.com/search?q=' + r.text" target="_blank">
                                Search for "{{r.text}}" on Google <i class="material-icons openlink">search</i>
                            </a>
                        </div>

                    </div>
                </td>
            </tr>
        </table>

        <br>
        <!-- Removed it as no loger required. -->
        <!-- <p class="copyright" v-if="answers.length > 0">Created by Team Champions_sam for 
            <a href="https://www.sih.gov.in">Smart India Hackathon - 2019.</a></p>
        <a id="bottom"></a> -->
    </section>

</main>
</template>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Roboto')
@import "App.sass"
</style>

<script>
import { ApiAiClient } from 'api-ai-javascript'
import config from './../config'

const client = new ApiAiClient({accessToken: config.app.token}) // <- replace it with yours

export default {
    name: 'app',
    data: function(){
        return {
            answers: [],
            query: '',
            speech: config.locale.strings.voiceTitle,
            micro: false,
            muted: config.app.muted,
            online: navigator.onLine,
            config
        }
    },
    watch: {
        answers: function(val){
            setTimeout(() => { 
                document.querySelector('#bottom').scrollIntoView({ 
                    behavior: 'smooth' 
                });
                console.log('CONSOLING..!');
            }, 2) // if new answers arrive, wait for render and then smoothly scroll down to #bottom selector, used as anchor
        }
    },
    methods: {
        submit(){
            client.textRequest(this.query).then((response) => {
                if(response.result.action == "input.unknown" && this.config.app.googleIt == true){
                    response.result.fulfillment.messages[0].unknown = true
                    response.result.fulfillment.messages[0].text = response.result.resolvedQuery
                } // if the googleIt is enabled, show the button

                this.answers.push(response)
                this.handle(response) // <- handle the response in handle() method

                this.query = ''
                this.speech = config.locale.strings.voiceTitle // <- reset query and speech
            })
        },
        handle(response){
            if(response.result.fulfillment.speech || response.result.fulfillment.messages[0].type == 'simple_response'){
                let speech = new SpeechSynthesisUtterance(response.result.fulfillment.speech || response.result.fulfillment.messages[0].textToSpeech)
                speech.voiceURI = 'native'
                speech.lang = config.locale.settings.speechLang

                if(this.muted == false) window.speechSynthesis.speak(speech) // <- Speech output if microphone is allowed
            }
        },
        autosubmit(suggestion){
            this.query = suggestion
            this.submit()
        },
        mute(mode){
            this.muted = mode
        },
        microphone(mode){
            this.micro = mode
            let self = this // <- correct scope

            if(mode == true){
                let recognition = new webkitSpeechRecognition() // <- chrome speech recognition

                recognition.interimResults = true
                recognition.lang = config.locale.settings.recognitionLang
			    recognition.start()

                recognition.onresult = function(event){
			        for (var i = event.resultIndex; i < event.results.length; ++i){
			    	    self.speech = event.results[i][0].transcript
			        }
			    }

			    recognition.onend = function(){
				    recognition.stop()
                    self.micro = false
                    self.autosubmit(self.speech)
			    }
            }
        }
    }
}
</script>