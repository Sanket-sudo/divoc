<template>
    <div class="container" id="form">
        <img src="../assets/logo.png" height="140">
        <h4>Enter the following details to Login:</h4>
        <div class="form-group">
            <label for="name">Enter Your Name:</label>
            <input type="text" class="form-control" id="name" ref="name">
            <br>
            <label for="meeting">Enter Meeting ID:</label>
            <input type="text" class="form-control" id="meeting" ref="meeting">
            <br>
            <label for="password">Enter Meeting Password:</label>
            <input type="password" class="form-control" id="password" ref="password">
            <br>
            <center><button type="button" class="btn btn-lg" @click="login">Login</button></center>
            <br>
            <div id="spinner"></div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import { obj } from '../App.vue'

    export default {
        data() {
            return {
                name: '',
                meeting: '',
                password: ''
            }
        },
        methods: {
            login() {
                let id = document.getElementById('spinner');
                id.className = 'spinner-border text-primary';
            
                this.name = this.$refs.name.value;
                this.meeting = this.$refs.meeting.value;
                this.password = this.$refs.password.value;
                obj.name = this.name;

                axios
                .post(`${obj.ip}/student/login`, {
                    meeting: this.meeting,
                    password: this.password
                }).then(
                    response => {
                        obj.hostId = response.data.prototype.hostId
                        this.$router.push({path: '/watcher'})
                    },
                    error => {
                        console.log(error);
                        this.$router.replace({path: '/'})
                    }
                );
            }
        }
    }
</script>

<style scoped>
#form {
    height: 700px;
    width: 500px;
}
div {
    margin-top: 30px;
}
</style>