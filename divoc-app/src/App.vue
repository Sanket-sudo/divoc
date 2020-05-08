<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
  export let obj = {
      token: '',
      name: '',
      ip: 'https://divoc-api.herokuapp.com',
      socketId: '',
      hostId: '',
      socket: ''
  }

export default {
  name: 'App'
}

    import io from 'socket.io-client'
    let socket = io(`${obj.ip}`);
    socket.on('gotid', function(id) {
        obj.socketId = id;
    })

    obj.socket = socket;
</script>
