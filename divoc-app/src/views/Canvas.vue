<template>
    <div class="container">
        <canvas id="drawCanvas" width="1100" height="550" style="border:1px solid #000000;"></canvas>
        <button @click="clearCanvas">Clear Canvas</button>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods: {
            clearCanvas() {
                let canvas = document.getElementById('drawCanvas');
                let ctx = canvas.getContext('2d');

                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
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
        }
    }
</script>

<style scoped>
div {
    margin-top: 30px;
}
</style>