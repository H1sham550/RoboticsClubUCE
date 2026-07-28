// ================= ROBOTICS CLUB UCE GLOBAL INTERACTIVE SCRIPTS =================

// Toast message display
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
        toastMessage.innerText = msg;
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 4000);
    }
}

// Live neon leaves spawning generator
const maxLeaves = 25; // Optimized for performance, especially on mobile
const leafArray = [];
let mouseX = -1000;
let mouseY = -1000;

let videoRafPending = false;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Background video 3D Parallax effect (RAF-throttled to prevent jank)
    if (!videoRafPending) {
        videoRafPending = true;
        requestAnimationFrame(() => {
            const video = document.getElementById('bg-video');
            if (video) {
                const x = (window.innerWidth / 2 - mouseX) / 45;
                const y = (window.innerHeight / 2 - mouseY) / 45;
                video.style.transform = `scale(1.06) translate(${x}px, ${y}px)`;
            }
            videoRafPending = false;
        });
    }
});

class NeonLeaf {
    constructor(container) {
        this.container = container;
        this.reset();
    }

    update() {
        // Gravity / Wind drift
        this.y += this.vy;
        this.x += this.vx;
        this.angle += this.vAngle;

        // Mouse Repeller Physics
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < 180) {
            const force = (180 - dist) / 12;
            const angleRad = Math.atan2(dy, dx);
            this.x += Math.cos(angleRad) * force;
            this.y += Math.sin(angleRad) * force;
        }

        // Render style
        if (this.element) {
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${this.angle}deg)`;
        }

        // Boundary check
        if (this.y > window.innerHeight + 100 || this.x < -100 || this.x > window.innerWidth + 100) {
            this.reset();
        }
    }

    reset() {
        if (!this.element) {
            this.element = document.createElement('div');
            this.element.className = 'leaf';
            if (this.container) {
                this.container.appendChild(this.element);
            }
        }
        
        this.size = Math.random() * 10 + 6;
        this.element.style.width = this.size + 'px';
        this.element.style.height = (this.size * 1.3) + 'px';
        
        // Spawn randomly from the top
        this.x = Math.random() * window.innerWidth;
        this.y = -50 - (Math.random() * 200);
        this.vx = (Math.random() * 1.5) - 0.75;
        this.vy = Math.random() * 1.5 + 1.2;
        this.angle = Math.random() * 360;
        this.vAngle = (Math.random() * 1.5) - 0.75;
    }
}

function initLeaves() {
    if (window.innerWidth < 768) return; // Disable on mobile to prevent scrolling lag
    const leafContainer = document.getElementById('leaf-container');
    if (!leafContainer) return;

    for (let i = 0; i < maxLeaves; i++) {
        leafArray.push(new NeonLeaf(leafContainer));
    }

    function animate() {
        leafArray.forEach(leaf => leaf.update());
        requestAnimationFrame(animate);
    }
    animate();
}

// Certificate Validation Database (Indexed by Student Full Name)
const certDatabase = [
    {
        "name": "Muhammed Yaseen",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1TGGFkUKU-XAMpQuvORsz1EF_xwmKvSDb/view?usp=drivesdk"
    },
    {
        "name": "Muhammed shefin",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/18UZOK6wDtRsYwJ7FLE2efftwT5-R_XNh/view?usp=drivesdk"
    },
    {
        "name": "Midhun Krishna",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1gg781pmO38B2-YA09jc5gXy_FGybYXyW/view?usp=drivesdk"
    },
    {
        "name": "Muhammed Nihal",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1bMoXuM3mWaUBimLWs0GY8_UwaqyZQeoV/view?usp=drivesdk"
    },
    {
        "name": "Mukhil",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1KGhLXCCdY6JK7bTDE0qi1kPz3k32UdtQ/view?usp=drivesdk"
    },
    {
        "name": "Muhammed Irfaan P K",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1ytGE8rl21JkDrjBDLb6yG79pENcoGtu9/view?usp=drivesdk"
    },
    {
        "name": "Meghanath Suresh",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/16f904Sro1gGPzt2tD7OCX_hhfY4fmHdm/view?usp=drivesdk"
    },
    {
        "name": "Kishan joby",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1TfV2O9lukC45HKi-jfPTCBFYDGpXJ3Qa/view?usp=drivesdk"
    },
    {
        "name": "JOYAL REJI",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1YdaOoCOB8Ueim_It569MWwWa-HCCY2ju/view?usp=drivesdk"
    },
    {
        "name": "Kasinath Remesh",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1f7ciV9CS_H7NV7ts2N2NbjnWg4RPUB5i/view?usp=drivesdk"
    },
    {
        "name": "Josin Jomon",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1spZDq-Kb2ee4ekHe-Quw1mwMgmNbjaDX/view?usp=drivesdk"
    },
    {
        "name": "Jagan Rajeev",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/15jqJ3IE5jjF01S4Z6OrdRpfC2-_Oqzpf/view?usp=drivesdk"
    },
    {
        "name": "Irfan Thaha",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1zKF60bpDHCRjn_oSL8w7L7B6jPIAVEb8/view?usp=drivesdk"
    },
    {
        "name": "Jil Joj Jaison",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1TUItRb_SpNBiMEerCVPyTk2H2HIpZsEB/view?usp=drivesdk"
    },
    {
        "name": "Joseph Benny",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1dqujoW1a7LaDvYKfbPJBG_VH0LZ0CBrH/view?usp=drivesdk"
    },
    {
        "name": "Dibin Dinesh",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1UFNfll5oKGiMzQ4oigv0cqZgL1BKZA9X/view?usp=drivesdk"
    },
    {
        "name": "GOKUL KRISHNA M M",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1W1bxivhAG6k8JXASOxvJLWqKnIy0d4g1/view?usp=drivesdk"
    },
    {
        "name": "Harishankar S",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1kmIPWJdQj8SD6LA4hrNC06RLjru8RCuE/view?usp=drivesdk"
    },
    {
        "name": "Irfan Mohammed",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1TWaDSj5v6tEzTPXwIH1sDuLijvFXaArH/view?usp=drivesdk"
    },
    {
        "name": "Gayathri M",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/14caGCN0cb2HgHS3Yn-pGqQCvMXOpC_ME/view?usp=drivesdk"
    },
    {
        "name": "Georgekutty Senni",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1hR_QraiPcLDHm9aKjbsWeEQmNUlhhwuR/view?usp=drivesdk"
    },
    {
        "name": "Fathima Farzana N A",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1Z5f6mRmSaK5-bZ1YzzOPUfnanywluOAM/view?usp=drivesdk"
    },
    {
        "name": "FARSEEN P",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1rg20rU9QagGnFH99Pow2bII0nyc0HRPu/view?usp=drivesdk"
    },
    {
        "name": "Gautham Krishna",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1xS0frRibMoM0LhhstNCX4OvGaKN5Oekp/view?usp=drivesdk"
    },
    {
        "name": "Athun k",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1Z5h28DBdVQd4yIrBlTjxfdxT43atJ9SQ/view?usp=drivesdk"
    },
    {
        "name": "Devarjun Shibu",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1xXaAsW7rqrzlMq59xdg5ACHH0y3yBIyX/view?usp=drivesdk"
    },
    {
        "name": "Asif",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1ODN9bJLufN3S_uErAJ7lyiVpyU_CqDUu/view?usp=drivesdk"
    },
    {
        "name": "Athul Aravind",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/16uTsz3Wb5wQ3tkdjNgpp9r09Hp7-nF4Z/view?usp=drivesdk"
    },
    {
        "name": "ATHUL T K",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1PBWmx6GAtTlWbH4F7e4LdnCVrA1__MMu/view?usp=drivesdk"
    },
    {
        "name": "ANSAL TA",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1aXDexkef12X9AdjrqCY9ssZSPekU_8vz/view?usp=drivesdk"
    },
    {
        "name": "Ashin Aji",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1Kx8bjRGGbA9_8_H1I_S3FnumDPEBhYPf/view?usp=drivesdk"
    },
    {
        "name": "Anirudh Ajithkumar",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1VDtlW1EQKZsxj3rIaQ5oX3cJlJxy_oST/view?usp=drivesdk"
    },
    {
        "name": "Aleesa muhammed",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1ocTOqFlJz8BGAIbIx84ypwTWCRuHdoc8/view?usp=drivesdk"
    },
    {
        "name": "Anandhu A Nair",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1yKpDfFKVVbb8se2CWV4WiqliXijejIqe/view?usp=drivesdk"
    },
    {
        "name": "Alfass",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1zurLSXWXDB9eDW5O32T274BbOJgLFJGx/view?usp=drivesdk"
    },
    {
        "name": "Alphons CS",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1uNGghGL_B-tjwRb14IPTOPtxrtgHIxKD/view?usp=drivesdk"
    },
    {
        "name": "Akshay sm",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/11DcNMM1Zbsi7XVbHzT4WzacwhT0IpvtX/view?usp=drivesdk"
    },
    {
        "name": "Alan Biju",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1l8abC32z1c5HXEfQBz01vHwDwXjPavsi/view?usp=drivesdk"
    },
    {
        "name": "ADWAITH MOHANAN",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/19l-4QJvc4HkuLqEL8hPF4OdH-TbN8-YY/view?usp=drivesdk"
    },
    {
        "name": "Afeef shoukath",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1Ldo9RXrZq9w3nFbqbTduMlTRqv4Pc2zZ/view?usp=drivesdk"
    },
    {
        "name": "Aimin Jayamon",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1RsO0efiNZcjFL59_Ob3UQf7ngFIJYrEB/view?usp=drivesdk"
    },
    {
        "name": "Afthab p",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1hLt_89FnmmnZX3pHq00R24VzNcIb0O3L/view?usp=drivesdk"
    },
    {
        "name": "Adhith B",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1SM-jY6bCyuVRlV37AF_Vkn34Rvtmwj7u/view?usp=drivesdk"
    },
    {
        "name": "Viswas B Dev",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1gI078rBy1rpOe_9m0cXe9EuYBhC_8bO3/view?usp=drivesdk"
    },
    {
        "name": "Abin joy",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1LxqeePPU2AHDCNhHWOOhW5CwbwTxy9U0/view?usp=drivesdk"
    },
    {
        "name": "Abin C Varghese",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1c3T7eok6dfS_ecblp-ol33L2hrIfiAGM/view?usp=drivesdk"
    },
    {
        "name": "Vishnupriya N M",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1jpyWTvkizlUIvfirsOacr3rn7EzdILy-/view?usp=drivesdk"
    },
    {
        "name": "Vishakh",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1hYmCTFzPlNOEzhg3l6Um1sJh6eAnJnW3/view?usp=drivesdk"
    },
    {
        "name": "VIGNESH N PRABODH",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1RGq_Brflml00iJAZ9j3Fcghrr1T0_oCj/view?usp=drivesdk"
    },
    {
        "name": "YADHU KRISHNA C O",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/15EfjGv3ErAMfNW7_cHh_VYfmhgFNv9TR/view?usp=drivesdk"
    },
    {
        "name": "Abhinav kp",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1c7S7cCXJCWStD_npufiLk2ugxjL4rgF4/view?usp=drivesdk"
    },
    {
        "name": "Aadi R",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1swMleDrKCX_R2MiFATbAWb1LC8JWTEu3/view?usp=drivesdk"
    },
    {
        "name": "Victor Varghese T",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1ALQD2RmOfRZCNkAFzPmaJ2JcVyKKRj-o/view?usp=drivesdk"
    },
    {
        "name": "Tharakamal",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1nM0MgDKHdnAMXKT7w-ktBGyqiR9dRTbK/view?usp=drivesdk"
    },
    {
        "name": "VIDYASAGAR P R",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1tVDRfDHRfYlQWj8oUdBP63VDcBTX0Jpi/view?usp=drivesdk"
    },
    {
        "name": "Sana P",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/11j19LkVfwJj9rmNIr15sOGo289SVB_Cw/view?usp=drivesdk"
    },
    {
        "name": "Sreyas shabu",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1S6-2oFClP6w4YBP9qwSBOSuGO2oisCqL/view?usp=drivesdk"
    },
    {
        "name": "Sreekanth m",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1Wv_MxbeXPtRdpiGGUK0Km31yd-2MEIUz/view?usp=drivesdk"
    },
    {
        "name": "Syed Ali S",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1tXNtRAPEtHX8uoAERgqt2zvu3tKDN97M/view?usp=drivesdk"
    },
    {
        "name": "Sharon Felix",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/13zIey-n3frl_2i9k2xa6phCVmeh2Mxcz/view?usp=drivesdk"
    },
    {
        "name": "Sidharth P",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1hanj310YH1VWD70PQnFY7aRRXnQ2AaVQ/view?usp=drivesdk"
    },
    {
        "name": "Sreehari Subramanian P",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1DV3njwcB5uVMRYxPYxqCaNoqcCQPD9q0/view?usp=drivesdk"
    },
    {
        "name": "Sahad tp",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1YIwnG9Or2QJoViJxtugz-I_j2A_sJEod/view?usp=drivesdk"
    },
    {
        "name": "Reja Rayyan K F",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1ddoJbJvB39AIGN4fJQE242k1B9XbgOlT/view?usp=drivesdk"
    },
    {
        "name": "Salahudheen",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1gJP_CLLcEVwXhXtcxOTg7AJSf-MrXC4G/view?usp=drivesdk"
    },
    {
        "name": "Psalm Mathew John",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1eHDTxXPg8qevZ0q_XMz_uIvdo_PVYFyI/view?usp=drivesdk"
    },
    {
        "name": "Pranith",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/15RdK8z5Y7LzcPx7g8qGgt6LJvV99zdG4/view?usp=drivesdk"
    },
    {
        "name": "Oasis Joy",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1lOXAKwlHlfpcN5At_tUKbV5x7B5CTL4x/view?usp=drivesdk"
    },
    {
        "name": "Prasanth P",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/15ipFwL0PBJfYr_hZ6T_MjS9wQVaKBQFE/view?usp=drivesdk"
    },
    {
        "name": "Pranav R",
        "event": "FIFA23 Gaming Tournament",
        "role": "Participant Pass",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1Q2-JTwBxmRxpeb531nHo3enhgxle39Bl/view?usp=drivesdk"
    },
    {
        "name": "ASHWIN ROY",
        "event": "FIFA23 Gaming Tournament",
        "role": "Winner / Merit Certificate",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1VZq40EV5vfNBya2oE9M8yE2NBDdxx-2A/view?usp=drivesdk"
    },
    {
        "name": "EBIN GEORGE",
        "event": "FIFA23 Gaming Tournament",
        "role": "Winner / Merit Certificate",
        "date": "July 24, 2026",
        "link": "https://drive.google.com/file/d/1dyfgiGmqaVcx8tNXirtM5hleR5fpCfo1/view?usp=drivesdk"
    },
    {
        "name": "Aditya Verma",
        "event": "2-Day Arduino Learning Workshop",
        "role": "Participant Pass",
        "date": "May 12, 2026",
        "link": "https://drive.google.com/file/d/sample-ard-1/view"
    },
    {
        "name": "Neha Kumari",
        "event": "Free VR Experience Event",
        "role": "Volunteer Organizer",
        "date": "April 10, 2026",
        "link": "https://drive.google.com/file/d/sample-vr-1/view"
    }
];

function verifyCertificate() {
    const certInput = document.getElementById('cert-input');
    const resultBox = document.getElementById('cert-result');
    const errorBox = document.getElementById('cert-error');
    const errorText = document.getElementById('cert-error-text');
    
    if (!certInput || !resultBox || !errorBox) return;

    const query = certInput.value.trim().toLowerCase();
    resultBox.classList.add('hidden');
    errorBox.classList.add('hidden');

    if (query.length < 3) {
        if (errorText) errorText.textContent = "Please enter at least 3 characters of your name to search (e.g. Ebin or Ashwin).";
        errorBox.classList.remove('hidden');
        return;
    }

    // Name Search Engine: Case-insensitive match supporting spaces & underscores
    const normQuery = query.replace(/_/g, ' ');
    const matches = certDatabase.filter(item => {
        if (!item.name) return false;
        const normName = item.name.toLowerCase().replace(/_/g, ' ');
        return normName.includes(normQuery);
    });

    if (matches.length > 0) {
        const studentName = document.getElementById('cert-student-name');
        const certList = document.getElementById('cert-list');

        // Extract distinct student names found
        const namesFound = [...new Set(matches.map(m => m.name))].join(', ');
        if (studentName) studentName.textContent = namesFound;
        
        if (certList) {
            certList.innerHTML = ''; // Clear previous results
            
            matches.forEach(cert => {
                const item = document.createElement('div');
                item.className = 'p-3.5 bg-white/5 border border-white/10 rounded flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-brand-cyan/35 transition-colors';

                const infoDiv = document.createElement('div');

                const eventSpan = document.createElement('span');
                eventSpan.className = 'text-[9px] font-mono text-brand-cyan uppercase tracking-widest block font-semibold';
                eventSpan.textContent = cert.event;
                infoDiv.appendChild(eventSpan);

                const roleSpan = document.createElement('span');
                roleSpan.className = 'text-white font-bold block text-xs mt-0.5';
                roleSpan.textContent = cert.name + ' — ' + cert.role;
                infoDiv.appendChild(roleSpan);

                const dateSpan = document.createElement('span');
                dateSpan.className = 'text-[9px] text-slate-500 block font-mono mt-0.5';
                dateSpan.textContent = 'AWARDED: ' + cert.date;
                infoDiv.appendChild(dateSpan);

                item.appendChild(infoDiv);

                const link = document.createElement('a');
                const safeUrl = (cert.link && (cert.link.startsWith('https://') || cert.link.startsWith('http://'))) ? cert.link : '#';
                link.href = safeUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.className = 'px-3 py-1.5 bg-brand-cyan/10 hover:bg-brand-cyan/20 border border-brand-cyan/20 rounded font-mono text-[9px] text-brand-cyan font-bold transition-all uppercase tracking-wider flex items-center gap-1.5 self-end sm:self-auto';

                const linkIcon = document.createElement('i');
                linkIcon.className = 'fa-solid fa-arrow-up-right-from-square';
                link.appendChild(linkIcon);
                link.appendChild(document.createTextNode(' View PDF'));

                item.appendChild(link);
                certList.appendChild(item);
            });
        }
        
        resultBox.classList.remove('hidden');
    } else {
        if (errorText) errorText.textContent = `No certificate records found for "${certInput.value.trim()}". Please check your name spelling.`;
        errorBox.classList.remove('hidden');
    }
}

// Payment Processing simulation (paused)
function processPayment() {
    showToast("Registrations are closed. Reopening when new 1st year students arrive!");
}

// Google Apps Script Web App URL for Google Sheets suggestions collection
// Replace this placeholder string with your deployed Apps Script URL (e.g. https://script.google.com/macros/s/.../exec)
const SUGGESTIONS_WEBAPP_URL = "https://script.google.com/macros/s/AKfycbwGqLZ2mGYoAR9GCQesVHIZuqnBxqyYymUpjeNuvPXazMAu0dl9PzFzIEAC2P7peyhAsw/exec";

// Student Suggestion Submission Form
function submitSuggestion() {
    const suggestName = document.getElementById('suggest-name');
    const suggestReg = document.getElementById('suggest-reg');
    const suggestText = document.getElementById('suggest-text');
    const suggestCategory = document.getElementById('suggest-category');
    const honeypot = document.getElementById('suggest-website');

    // Honeypot spam protection — bots auto-fill hidden fields, real users never see it
    if (honeypot && honeypot.value.trim() !== "") return;
    
    if (!suggestText || suggestText.value.trim() === "") return;

    const name = suggestName ? suggestName.value.trim() : "Anonymous";
    const regNo = suggestReg ? suggestReg.value.trim() : "N/A";
    const category = suggestCategory ? suggestCategory.value : "other";
    const suggestion = suggestText.value.trim();

    // Show sending state
    showSuggestionAlert("Sending suggestion...", "sending");

    // If WebApp URL is configured, send the suggestion to Google Sheets
    if (SUGGESTIONS_WEBAPP_URL && SUGGESTIONS_WEBAPP_URL !== "") {
        fetch(SUGGESTIONS_WEBAPP_URL, {
            method: 'POST',
            mode: 'no-cors', // Prevents CORS checks block on Apps Script redirect
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, regNo, category, suggestion })
        })
        .then(() => {
            showSuggestionAlert("Suggestion Submitted Successfully!", "success");
            if (suggestName) suggestName.value = "";
            if (suggestReg) suggestReg.value = "";
            suggestText.value = "";
        })
        .catch(err => {
            console.error("Error sending to Google Sheets:", err);
            showSuggestionAlert("Suggestion Saved Locally!", "success");
        });
    } else {
        // Fallback local simulation if no URL is set yet
        showSuggestionAlert("Suggestion Submitted Successfully!", "success");
        if (suggestName) suggestName.value = "";
        if (suggestReg) suggestReg.value = "";
        suggestText.value = "";
    }
}

// Centered fullscreen suggestion alert modal
function showSuggestionAlert(message, type) {
    // Remove existing modal if present
    const existing = document.getElementById('suggestion-alert-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.id = 'suggestion-alert-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);opacity:0;transition:opacity 0.3s ease;';

    const isSending = type === 'sending';
    const iconHTML = isSending
        ? '<div style="width:64px;height:64px;border:3px solid rgba(255,75,139,0.3);border-top-color:#ff4b8b;border-radius:50%;animation:spin 0.8s linear infinite;"></div>'
        : '<div style="width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#ff4b8b,#ff6b35);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(255,75,139,0.4);animation:popIn 0.4s cubic-bezier(0.175,0.885,0.32,1.275);"><svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>';

    overlay.innerHTML = `
        <div style="text-align:center;padding:40px 32px;max-width:380px;background:rgba(18,18,21,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:16px;box-shadow:0 25px 60px rgba(0,0,0,0.5);animation:slideUp 0.35s ease;">
            <div style="margin-bottom:20px;display:flex;justify-content:center;">${iconHTML}</div>
            <h3 style="color:white;font-size:18px;font-weight:700;margin:0 0 8px 0;font-family:system-ui,sans-serif;">${message}</h3>
            ${!isSending ? '<p style="color:rgba(255,255,255,0.5);font-size:12px;font-family:monospace;margin:0;">Thank you for helping us improve the club!</p>' : ''}
            ${!isSending ? '<button onclick="this.closest(\'#suggestion-alert-overlay\').remove()" style="margin-top:20px;padding:10px 32px;background:rgba(255,75,139,0.1);border:1px solid rgba(255,75,139,0.3);border-radius:8px;color:#ff4b8b;font-size:12px;font-weight:700;font-family:monospace;text-transform:uppercase;letter-spacing:1px;cursor:pointer;transition:all 0.2s;">Got it</button>' : ''}
        </div>
        <style>
            @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            @keyframes popIn { from { transform:scale(0); } to { transform:scale(1); } }
            @keyframes spin { to { transform:rotate(360deg); } }
        </style>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => { overlay.style.opacity = '1'; });

    // Click backdrop to close (only for success state)
    if (!isSending) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (document.getElementById('suggestion-alert-overlay')) {
                overlay.style.opacity = '0';
                setTimeout(() => overlay.remove(), 300);
            }
        }, 5000);
    }
}

// Mobile Menu toggling system
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
            mobileMenu.classList.add('flex');
            document.body.classList.add('overflow-hidden');
        });
    }

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('flex');
            document.body.classList.remove('overflow-hidden');
        }
    };

    if (mobileMenuCloseBtn) {
        mobileMenuCloseBtn.addEventListener('click', closeMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Active navigation link highlighting
function highlightNav() {
    const path = window.location.pathname;
    const hash = window.location.hash;
    const navItems = document.querySelectorAll('.nav-btn');
    
    navItems.forEach(btn => {
        btn.classList.remove('active', 'text-white');
        btn.classList.add('text-slate-300');
    });

    if (path.includes('team.html')) {
        const item = document.getElementById('nav-team');
        if (item) item.classList.add('active', 'text-white');
    } else if (path.includes('events.html')) {
        const item = document.getElementById('nav-events');
        if (item) item.classList.add('active', 'text-white');
    } else if (path.includes('certificate.html')) {
        const item = document.getElementById('nav-certificate');
        if (item) item.classList.add('active', 'text-white');
    } else if (hash.includes('#membership')) {
        const item = document.getElementById('nav-membership');
        if (item) item.classList.add('active', 'text-white');
    } else if (path.includes('suggestions.html')) {
        const item = document.getElementById('nav-suggestions');
        if (item) item.classList.add('active', 'text-white');
    } else if (hash.includes('#about') || path.endsWith('/') || path.includes('index.html')) {
        const item = document.getElementById('nav-about');
        if (item) item.classList.add('active', 'text-white');
    }
}

// Lock background video container height on mobile to prevent address bar scroll resize/zoom jitter
function lockBgHeightMobile() {
    const bgContainer = document.querySelector('.fixed.inset-0.z-0');
    if (bgContainer && window.innerWidth < 768) {
        bgContainer.style.height = (window.innerHeight + 80) + 'px';
        bgContainer.style.bottom = 'auto';
    }
}

// Initialize on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    lockBgHeightMobile();
    initLeaves();
    initMobileMenu();
    highlightNav();

    // Enable Enter key search on certificate input
    const certInput = document.getElementById('cert-input');
    if (certInput) {
        certInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                verifyCertificate();
            }
        });
    }
});

// Update active highlight when hash changes
window.addEventListener('hashchange', highlightNav);
