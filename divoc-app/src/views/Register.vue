<template>
    <div class="container" id="form">
        <h3>Enter the following details to Register:</h3>
        <br>
        <div class="form-group">
            <label for="name">Enter Teacher Name:</label>
            <input type="text" class="form-control" id="name" ref="name">
            <br>
            <label for="username">Enter Teacher Username:</label>
            <input type="text" class="form-control" id="username" ref="username">
            <br>
            <label for="password">Enter Your Password:</label>
            <input type="password" class="form-control" id="password" ref="password">
            <br>
            <center><button type="button" class="btn btn-primary btn-lg" @click="register">Register</button></center>
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
                username: '',
                password: ''
            }
        },
        methods: {
            register() {
                this.name = this.$refs.name.value
                this.username = this.$refs.username.value
                this.password = this.$refs.password.value
                axios
                .post(`${obj.ip}/register/teacher`, {
                    name: `${this.name}`,
                    username: `${this.username}`,
                    password: `${this.password}`
                }).then(
                    response => {
                        console.log(response)
                        alert('Teacher successfully registered')
                    },
                    error => {
                        console.log(error)
                        console.log('Error in registering')
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