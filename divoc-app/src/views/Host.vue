<template>
    <div class="container">
        <div style="width: 70%; float:left">
            
            <h5>
            <strong>Meeting:</strong> {{meeting}}
             | 
            <strong>Password:</strong> {{password}}
            </h5>
            <button class="btn btn-sm" @click="copyMeeting">Copy to Clipboard</button>
            <br><br>
            <center>
                <video id="video" controls width="720" height="400"></video>
                <br><br>
                <button class="btn btn-lg" @click="start">Start the Lecture</button>
                &emsp;
                <button class="btn btn-lg" @click="openCanvas">Open Canvas</button>
                &emsp;
                <button class="btn btn-lg" @click="openQuestion">Ask a Question</button>
            </center>
        </div>

        <div id="myModal" class="modal">
            <div class="modal-content">
                <table>
                <tr>
                    <th><button class="btn" @click="clearCanvas">Clear Canvas</button></th>
                    <th><span class="close">&times;</span></th>
                </tr>
                </table>
                <canvas id="drawCanvas" width="1100" height="550" style="border:1px solid #000000;"></canvas>
            </div>
        </div>

        <div id="myModalQuestion" class="modalQuestion">
            <div class="modal-content-question">
                <span class="closeQuestion">&times;</span>
                <div class="container">
                    <table width="1100">
                        <tr>
                            <th width="70%">
                                <div class="form-group">
                                    <label for="question">Enter Question:</label>
                                    <input type="text" class="form-control" id="question" ref="question">
                                    <br>
                                    <label for="option1">Enter Option A:</label>
                                    <input type="text" class="form-control" id="option1" ref="option1">
                                    <label for="option2">Enter Option B:</label>
                                    <input type="text" class="form-control" id="option2" ref="option2">
                                    <label for="option3">Enter Option C:</label>
                                    <input type="text" class="form-control" id="option3" ref="option3">
                                    <label for="option4">Enter Option D:</label>
                                    <input type="text" class="form-control" id="option4" ref="option4">
                                    <br>
                                    <label for="answer">Enter Correct Answer:</label>
                                    <input type="text" class="form-control" id="answer" ref="answer" placeholder="Enter A,B,C,D">
                                </div>
                            </th>
                            <th width="30%">
                                <br>
                                <center><button type="button" class="btn btn-lg" @click="sendQuestion">Send</button></center>
                                &emsp;&emsp;
                                <div id="sent"></div>
                            </th>
                        </tr>
                    </table>
                </div>
            </div>
        </div>

        <div style="width: 30%; float: right" align="left">
            Joined Students :
            <ul class="list-group mb-5 border border-dark" id="students">
            </ul>
            DoubtBox :
            <div id="chat">
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { obj } from '../App.vue'

    const socket = obj.socket;
    let peerConnectionVideo = {};
    let media = new MediaStream();

    export default {
        data() {
            return {
                name: '',
                meeting: '',
                password: '',
            }
        },
        created() {
            this.name = obj.name;
            this.meeting = obj.socketId;
            axios
            .post(`${obj.ip}/route/protection`, {
                token: `${obj.token}`
            }).then(
                () => {
                    axios
                    .post(`${obj.ip}/meeting/create`, {
                        id: this.meeting
                    }).then(
                        response => {
                            this.password = response.data.prototype.password
                        },
                        error => {
                            console.log(error);
                            this.$router.replace({path: '/'})
                        }
                    );
                },
                error => {
                    console.log(error);
                    this.$router.replace({path: '/'})
                }
            );
        },
        mounted() {
            let canvas = document.getElementById('drawCanvas');
            let ctx = canvas.getContext('2d');
            let isActive = false;
            let plots = [];
            
            ctx.lineWidth = '4';
            
            canvas.addEventListener('mousedown', startDraw, false);
            canvas.addEventListener('mousemove', draw, false);
            canvas.addEventListener('mouseup', endDraw, false);
            
            function draw(e) {
                if(!isActive) return;
                
                var x = e.offsetX || e.layerX - canvas.offsetLeft;
                var y = e.offsetY || e.layerY - canvas.offsetTop;
                
                plots.push({x: x, y: y});
                drawOnCanvas(plots);
            }
            
            function startDraw() {
                isActive = true;
            }
            
            function endDraw() {
                isActive = false;
                
                // empty the array
                plots = [];
            }
            
            function drawOnCanvas(plots) {
                ctx.beginPath();
                ctx.moveTo(plots[0].x, plots[0].y);
                
                for(var i=1;i<plots.length;i++)
                {
                    ctx.lineTo(plots[i].x, plots[i].y);
                }
                ctx.stroke();
            }

            document.querySelector('.closeQuestion').addEventListener('click', () => {
                media.getVideoTracks()[0].enabled = true;
            })
        },
        methods: {
            sendQuestion() {
                let question = this.$refs.question.value;
                let option1 = this.$refs.option1.value;
                let option2 = this.$refs.option2.value;
                let option3 = this.$refs.option3.value;
                let option4 = this.$refs.option4.value;
                let answer = this.$refs.answer.value;
                socket.emit('sendQuestion', {
                    question: question,
                    option1: option1,
                    option2: option2,
                    option3: option3,
                    option4: option4,
                    answer: answer
                });
                this.$refs.question.value = '';
                this.$refs.option1.value = '';
                this.$refs.option2.value = '';
                this.$refs.option3.value = '';
                this.$refs.option4.value = '';
                this.$refs.answer.value = '';

                media.getVideoTracks()[0].enabled = true;

                document.getElementById('sent').innerHTML = 'Question Sent Successfully';

                setTimeout(function() {
                    document.getElementById('sent').innerHTML = '';
                }, 1000)
            },

            clearCanvas() {
                let canvas = document.getElementById('drawCanvas');
                let ctx = canvas.getContext('2d');

                ctx.clearRect(0, 0, canvas.width, canvas.height);
            },

            openQuestion() {
                media.getVideoTracks()[0].enabled = false;
                let modal = document.getElementById("myModalQuestion");
                var span = document.getElementsByClassName("closeQuestion")[0];
                modal.style.display = "block";
                span.onclick = function() {
                    modal.style.display = "none";
                }
            },
            
            openCanvas() {
                let modal = document.getElementById("myModal");
                var span = document.getElementsByClassName("close")[0];
                modal.style.display = "block";
                span.onclick = function() {
                    modal.style.display = "none";
                }
            },

            copyMeeting() {
                navigator.clipboard.writeText(`Meeting Id: ${this.meeting} Password: ${this.password}`)
                .then(function() {
                    alert('Copied');
                })
                .catch(function() {
                    alert('Sorry Error in copying');
                })
            },

            start() {
                let constraintObj = {
                    video: {
                        // width: {ideal: 4096},
                        // height: {ideal: 2169},
                        width: {ideal: 1280},
                        height: {ideal: 720}
                    },
                    audio: true
                }

                navigator.mediaDevices.getDisplayMedia(constraintObj)
                .then(function(mediaStreamObj) {
                    let video = document.getElementById('video');
                    if ("srcObject" in video) {
                        mediaStreamObj.getTracks().forEach(track => {
                            media.addTrack(track, mediaStreamObj);
                        });
                    } else {
                        video.src = window.URL.createObjectURL(mediaStreamObj);
                    }
                })
                .catch(function(err) {
                    console.log(err.name, err.message);
                });
                
                constraintObj = {
                    audio: {
                        noiseSuppression: true,
                        echoCancellation: true,
                        autoGainControl: true,
                        googEchoCancellation: true,
                        googNoiseSuppression: true,
                        googAutoGainControl: true,
                        googHighpassFilter: true,
                    },
                    video: false
                };
                
                navigator.mediaDevices.getUserMedia(constraintObj)
                .then(function(mediaStreamObj) {
                    let video = document.getElementById('video');
                    if ("srcObject" in video) {
                        mediaStreamObj.getTracks().forEach(track => {
                            media.addTrack(track, mediaStreamObj);
                        });

                        video.srcObject = media;
                        video.muted = true;

                        video.onloadedmetadata = function() {
                            video.play();
                        }
                    } else {
                        video.src = window.URL.createObjectURL(mediaStreamObj);
                    }
                })
                .catch(function(err) {
                    console.log(err.name, err.message);
                });
            }
        }
    }

    socket.on('requestLectureServer', function(student) {
        console.log('>>>In requestLectureServer');
        let id = student.socketId;
        console.log('watcher id got = ', id);

        const config = {
            'iceServers':[
                {
                    'urls':[
                        'turn:numb.viagenie.ca'
                    ],
                    'username': 'jgf81840@eoopy.com',
                    'credential': 'Helloworld.123'
                }
            ]
        }
        let localPeerConnectionVideo = new RTCPeerConnection(config);
        peerConnectionVideo[id] = localPeerConnectionVideo;

        localPeerConnectionVideo.onicecandidate = function(event) {
            if(event.candidate) {
                socket.emit('candidate', {
                    id: id,
                    candidate: event.candidate
                })
            }
        }

        // Video
        media.getTracks().forEach(track => {
            localPeerConnectionVideo.addTrack(track, media);
        });

        localPeerConnectionVideo.createOffer()
        .then(function (sdp) {
            localPeerConnectionVideo.setLocalDescription(sdp)
            .then(function() {
                console.log('Video local description set');

                let ul = document.getElementById('students');
                let li = document.createElement('li');
                li.id = id;
                console.log('logging li id', li.id);
                li.className = 'list-group-item';
                li.appendChild(document.createTextNode(student.name + ' / ' + '0'));
                ul.appendChild(li);

                console.log('Emitted the lecture')

                socket.emit('lecture', {
                    student: student,
                    video: localPeerConnectionVideo.localDescription,
                });
            });
        });
    });

    socket.on('answerVideoServer', function(message) {
        console.log('>>>In answerVideoServer');
        let id = message.student.socketId;
        console.log(id);
        peerConnectionVideo[id].setRemoteDescription(message.desc);
        message.candidates.forEach(candidate => {
            peerConnectionVideo[id].addIceCandidate(new RTCIceCandidate(candidate));
        });
        console.log('Ice Candidates Set');
    });

    socket.on('leftMeeting', function(data) {
        let ul = document.getElementById('students');
        ul.childNodes.forEach((node, index) => {
            if (node.id == data.socketId) {
                ul.removeChild(ul.childNodes[index]);
                return;
            }
        });
    });

    socket.on('doubtServer', function(data) {
        let ul = document.getElementById('students');
        let name;
        ul.childNodes.forEach(node => {
            if (node.id == data.socketId) {
                name = node.innerHTML;
            }
        });
        if(name === undefined)
            return;
        let chat = document.getElementById('chat');
        let strong = document.createElement('strong');
        strong.appendChild(document.createTextNode(name.split('/')[0]));
        let br = document.createElement('br');
        chat.appendChild(strong);
        chat.appendChild(document.createTextNode(' : ' + data.message));
        chat.appendChild(br);

        chat.scrollTop = chat.scrollHeight;
    })

    socket.on('addTabCount', function(data) {
        let ul = document.getElementById('students');
        ul.childNodes.forEach((node) => {
            if (node.id == data.socketId) {
                let split = node.innerHTML.split('/');
                let count = parseInt(split[1])+1;
                node.innerHTML = split[0] + ' / ' + count;
                return;
            }
        });
    })
</script>

<style scoped>
#video {
    border: 2px solid #6b7a78;
}

.list-group {
    max-height: 250px;
    overflow-y: scroll;
}

#chat {
    max-height: 300px;
    overflow-y: scroll;
}

div {
    margin-top: 20px;
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  background-color: #fefefe;
  margin: auto;
  border: 1px solid #888;
  width: 80%;
}

.close {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}

.modalQuestion {
  display: none;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content-question {
  background-color: #fefefe;
  margin: auto;
  border: 1px solid #888;
  width: 80%;
}

.closeQuestion {
  color: #aaaaaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.closeQuestion:hover,
.closeQuestion:focus {
  color: #000;
  text-decoration: none;
  cursor: pointer;
}
</style>