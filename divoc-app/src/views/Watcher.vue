<template>
    <div class="container">
        <div style="width: 70%; float:left">
            <center>
                <video id="video" controls width="720" height="400"></video>
                <br><br>
                <div class="alert alert-primary">
                    Double Click on Video to view in Full Screen
                </div>
            </center>
        </div>
        <div style="width: 30%; float: right">
            <strong>DoubtBox :</strong>
            <div class="form-group">
                <label for="message">Enter message :</label>
                <input type="text" class="form-control" id="message" ref="message">
                <br>
                <button type="button" class="btn btn-sm" style="float: right;" @click="send">Send</button>
                <div>
                    <center>
                        <strong id="joining-text"></strong>
                        <br>
                        <div id="joining-spinner"></div>
                    </center>
                </div>
            </div>
            <div id="sent"></div>
            <div id="question">
            </div>
            <div class="form-group">
                <input type="text" placeholder="Use this to answer questions" class="form-control" id="answer" ref="answer">
                <br>
            </div>
            <button class="btn btn-sm" @click="check">Check</button>
            <div id="checked"></div>
        </div>
    </div>
</template>

<script>
    import { obj } from '../App.vue'

    const socket = obj.socket;
    let correct_answer;

    const config = {
        'iceServers': [
            {
                'urls':[
                    'turn:numb.viagenie.ca'
                ],
                'username': 'jgf81840@eoopy.com',
                'credential': 'Helloworld.123'
            }
        ]
    }
    const peerConnectionVideo = new RTCPeerConnection(config);
    let candidates = [];

    export default {
        data() {
            return {
                hostId: '',
                socketId: ''
            }
        },
        created() {
            this.hostId = obj.hostId;
            this.socketId = obj.socketId;

            if(obj.hostId == '')
                this.$router.replace({path: '/'})

            console.log('>>>In created')
            console.log('hostId', this.hostId);
            console.log('socketId', this.socketId);
            console.log('Emitted to requestLecture');

            socket.emit('requestLecture', {
                hostId: this.hostId,
                socketId: this.socketId,
                name: obj.name
            });
        },
        mounted() {
            window.addEventListener('blur', this.leftWindow);
        },
        methods: {
            check() {
                if(correct_answer == this.$refs.answer.value.toUpperCase()) {
                    document.getElementById('checked').innerHTML = 'Hurray Correct Answer'
                } else {
                    document.getElementById('checked').innerHTML = 'Wrong Answer, Please Pay Attention to Lecture'
                }

                document.getElementById('question').innerHTML = '';
            },

            send() {
                let message = this.$refs.message.value;
                socket.emit('doubt', {
                    hostId: this.hostId,
                    socketId: this.socketId,
                    message: message
                });
                this.$refs.message.value = "";

                let sent = document.getElementById('sent');
                sent.innerHTML = "Message sent successfully";

                setTimeout(function() {
                    sent.innerHTML = "";
                }, 2020);
            },
            leftWindow() {
                socket.emit('tabChanged', {
                    socketId: this.socketId,
                    hostId: this.hostId,
                })

                alert('Please Pay Attention, Your Tab Change Count is Recorded');
            }
        }
    }

    socket.on('gotLecture', function(lecture) {
        console.log('>>>In gotLecture');

        peerConnectionVideo.setRemoteDescription(lecture.video)
        .then(() => peerConnectionVideo.createAnswer())
        .then(sdp => peerConnectionVideo.setLocalDescription(sdp))
        .then(function() {
            console.log('Local description of student set')
            let text = document.getElementById('joining-text');
            let spin = document.getElementById('joining-spinner');
            text.innerHTML = '&emsp;&emsp;&emsp;Connecting...'
            spin.className = 'spinner-border text-primary'

            setTimeout(function() {
                console.log('emitting answer in gotLecture after 7 seconds');
                socket.emit('answerVideo', {
                    student: lecture.student,
                    desc: peerConnectionVideo.localDescription,
                    candidates: candidates
                });

                text.innerHTML = '';
                spin.className = '';
            }, 7070);
        });

        peerConnectionVideo.onicecandidate = function(event) {
            if(event.candidate) {
                candidates.push(event.candidate);
            }
        }
    });

    peerConnectionVideo.ontrack = function (event) {
        console.log('>>>In on track')
        const video = document.getElementById('video');
        video.srcObject = event.streams[0];
        video.playsinline = true;
        video.autoplay = true;
    }

    socket.on('candidate', function(data) {
        console.log('Added Ice candidate');
        peerConnectionVideo.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    socket.on('question', function(data) {
        correct_answer = data.answer.toUpperCase();

        let question = document.getElementById('question');
        let strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Question'));
        let br = document.createElement('br');
        question.appendChild(strong);
        question.appendChild(document.createTextNode(' : ' + data.question));
        question.appendChild(br.cloneNode());

        strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Option A'));
        question.appendChild(strong);
        question.appendChild(document.createTextNode(' : ' + data.option1));
        question.appendChild(br.cloneNode());

        strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Option B'));
        question.appendChild(strong);
        question.appendChild(document.createTextNode(' : ' + data.option2));
        question.appendChild(br.cloneNode());
        
        strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Option C'));
        question.appendChild(strong);
        question.appendChild(document.createTextNode(' : ' + data.option3));
        question.appendChild(br.cloneNode());

        strong = document.createElement('strong');
        strong.appendChild(document.createTextNode('Option D'));
        question.appendChild(strong);
        question.appendChild(document.createTextNode(' : ' + data.option4));
        question.appendChild(br.cloneNode());
    })
</script>

<style scoped>
#form {
    height: 700px;
    width: 500px;
}
#video {
    border: 2px solid #6b7a78;
}
.alert {
    padding: 10px;
    border-radius: 10px;
    width: 40%;
}
div {
    margin-top: 30px;
}
</style>