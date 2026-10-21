<!DOCTYPE html>
<html>
<head>
  <style>
    canvas {
        border: solid 1px #bbb;
        border-radius: 4px;
        background: #111424; 
    }
  </style>
</head>
<body>

    <canvas id="myCanvas" width="500" height="300"></canvas>
    <script>
        const canvas = document.getElementById("myCanvas");
        const context = canvas.getContext("2d");
        
        let droplets = [];
        let windSpeed = 0; 
        let time = 0;

        // --- Thunderstorm & Lightning Variables ---
        let flashOpacity = 0; // 0 means no flash, 1 means pure white flash

        // --- Cloud Setup ---
        // Clouds move independent of the shifting storm wind, drifting from right to left
        let clouds = [
            { x: 50,  y: -10, radius: 40, speed: 0.15 },
            { x: 180, y: -20, radius: 55, speed: 0.10 },
            { x: 320, y: -5,  radius: 35, speed: 0.20 },
            { x: 450, y: -15, radius: 48, speed: 0.12 }
        ];

        function createDroplet() {
            return {
                x: Math.random() * (canvas.width + 400) - 200, 
                y: -20, 
                length: Math.random() * 8 + 12, 
                thickness: Math.random() * 1 + 1, 
                speedY: Math.random() * 5 + 12, 
                color: "rgba(221, 255, 255, 0.6)" 
            };
        }

        // Helper function to draw a puffy cloud layer using overlapping circles
        function drawCloud(cx, cy, r) {
            context.fillStyle = "rgba(45, 50, 75, 0.85)"; // Dark storm cloud color
            context.beginPath();
            context.arc(cx, cy, r, 0, Math.PI * 2);
            context.arc(cx - r * 0.5, cy + r * 0.2, r * 0.7, 0, Math.PI * 2);
            context.arc(cx + r * 0.5, cy + r * 0.2, r * 0.7, 0, Math.PI * 2);
            context.fill();
        }

        function animate() {
            // 1. Base clear
            context.clearRect(0, 0, canvas.width, canvas.height);

            // 2. Lightning Flash Logic
            // If a flash isn't happening, have a very tiny chance (0.3%) to strike a flash
            if (flashOpacity <= 0 && Math.random() < 0.003) {
                flashOpacity = Math.random() * 0.4 + 0.5; // Random flash peak intensity
            }
            
            // Draw the lighting background overlay if flash is active
            if (flashOpacity > 0) {
                context.fillStyle = `rgba(255, 255, 255, ${flashOpacity})`;
                context.fillRect(0, 0, canvas.width, canvas.height);
                flashOpacity -= 0.04; // Fade out the flash smoothly over frames
            }

            // 3. Move and Draw Clouds (Before rain so rain overlays them)
            for (let i = 0; i < clouds.length; i++) {
                let c = clouds[i];
                c.x -= c.speed; // Drift from right to left

                // Wrap around the screen once a cloud drifts entirely off the left side
                if (c.x < -c.radius * 2) {
                    c.x = canvas.width + c.radius * 2;
                }

                drawCloud(c.x, c.y, c.radius);
            }

            // 4. Update shifting wind
            time += 0.005; 
            windSpeed = Math.sin(time) * 4; 

            // Spawn rain droplets
            const spawnRate = 3;
            if (droplets.length < 400) { 
                for (let i = 0; i < spawnRate; i++) {
                    droplets.push(createDroplet());
                }
            }

            // 5. Update and Draw Rain
            for (let i = 0; i < droplets.length; i++) {
                let d = droplets[i];
                d.y += d.speedY;
                d.x += windSpeed;

                context.beginPath();
                context.strokeStyle = d.color;
                context.lineWidth = d.thickness;
                context.moveTo(d.x, d.y); 
                context.lineTo(d.x + (windSpeed * 1.5), d.y + d.length); 
                context.stroke();
            }

            // 6. Memory Cleanup
            droplets = droplets.filter(d => 
                d.y <= canvas.height + d.length && 
                d.x >= -250 && 
                d.x <= canvas.width + 250
            );

            requestAnimationFrame(animate);
        }

        animate();
    </script>

</body>
</html>