<template>
    <div class="container" id="form">
        <img src="../assets/logo.png" height="170">
        <h4>Enter the following details to Login:</h4>
        <br>
        <div class="form-group">
            <label for="username">Enter Your Username:</label>
            <input type="text" class="form-control" id="username" ref="username">
            <br>
            <label for="password">Enter Your Password:</label>
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
                username: '',
                password: '',
            }
        },
        methods: {
            login() {
                let id = document.getElementById('spinner');
                id.className = 'spinner-border text-primary';

                this.username = this.$refs.username.value
                this.password = this.$refs.password.value
                axios
                .post(`${obj.ip}/register/login`, {
                    username: `${this.username}`,
                    password: `${this.password}`
                }).then(
                    response => {
                        obj.token = response.data.prototype.token
                        obj.name = response.data.prototype.name
                        this.$router.push({path: '/host'})
                    },
                    error => {
                        obj.token = '';
                        console.log(error);
                        alert('Error in Logging In')
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