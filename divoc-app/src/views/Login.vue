<template>
    <div class="">
        <br><br><br>
        <img src="../assets/logo.png">
        <br><br><br>
        <button class="btn btn-lg" @click="teacher"> Teacher Login </button>
        <br><br>
        <button class="btn btn-lg" @click="student"> Student Login </button>
        <!-- <div class="footer">
            Developed by Sanket Kankarej
            <br>
            Contact: 9011648598
            <br>
            Email: sanket.kankarej2010@gmail.com
        </div> -->
    </div>
</template>

<script>
    export default {
        methods: {
            student() {
                this.$router.push({path: '/student'})
            },
            teacher() {
                this.$router.push({path: '/teacher'})
            }
        }
    }
</script>

<style scoped>

h1 {
    color: black;
    font-size: 100px;
}

.footer {
    position: fixed;
    font-family: cursive;
    right: 50px;
    bottom: 30px;
    font-size: 20px;
    text-align: right;
    color: black;
}
</style>