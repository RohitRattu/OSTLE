document.addEventListener("DOMContentLoaded", async () => {
    const audioPlayer = document.getElementById("audio-player");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const stopButton = document.getElementById("stop-btn");
    const answerInput = document.getElementById("answer-input");
    const suggestionList = document.getElementById("suggestions");
    const scoreDisplay = document.getElementById("score");
    const resultDisplay = document.getElementById("result");

    let score = parseInt(localStorage.getItem("score")) || 0;
    console.log("Score:", score);
    scoreDisplay.textContent = `Score: ${score}`;

    let isPlaying = false;

    //Load Answers/Audio
    const GITHUB_REPO_URL = "https://raw.githubusercontent.com/rohitkra/Misc/refs/heads/main/misc/ostle/";
    const ANSWERS_JSON = "https://raw.githubusercontent.com/rohitkra/Misc/refs/heads/main/misc/ostle/answers.json";

    let correctAnswer = "";
    let answerList = [];

    const lastSubmissionDate = localStorage.getItem("lastSubmissionDate");
    const currentDate = new Date().toDateString();

    if (lastSubmissionDate === currentDate) {
        answerInput.disabled = true;
        resultDisplay.textContent = "You have already submitted today's answer!";
        resultDisplay.style.color = "blue";
    }


    async function loadAnswers() {
        try {
            const response = await fetch(ANSWERS_JSON);
            if (!response.ok) {
                throw new Error("Failed to load answers");
            }
            const data = await response.json();
            answerList = data.answers.map(item => item.answer);

            //daily answer
            const dailyIndex = new Date().getDate() % data.answers.length;
            const dailyAudio = data.answers[dailyIndex].audio;
            correctAnswer = data.answers[dailyIndex].answer;
            console.log("Daily Answer:", correctAnswer, dailyAudio, answerInput, answerList);
            audioPlayer.src = `${GITHUB_REPO_URL}${dailyAudio}`;
        } catch (error) {
            console.error(error);
        }
    }

    await loadAnswers();

    //Play / Pause Song
    playPauseBtn.addEventListener("click", () => {
        if (!isPlaying) {
            audioPlayer.play().catch(error => console.error("Playback failed:", error));
            playPauseBtn.textContent = "Pause";
        } else {
            audioPlayer.pause();
            playPauseBtn.textContent = "Play";
        }
        isPlaying = !isPlaying;
    });
    
    answerInput.addEventListener("input", () => {
        const query = answerInput.value.toLowerCase();
        console.log(query);
        
        suggestionList.innerHTML = "";
        

        if (query.length === 0) return;

        const filtered = answerList.filter(ans => ans.toLowerCase().includes(query));
        console.log(filtered);
        filtered.forEach(suggestion => {
            console.log(filtered);
            console.log(query);
            console.log(suggestion);
            const item = document.createElement("div");
            item.classList.add("suggestion-item");
            item.textContent = suggestion;
            item.addEventListener("click", () => {
                answerInput.value = suggestion;
                suggestionList.innerHTML = "";
            });
            suggestionList.appendChild(item);
        });
    });


    answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            checkAnswer();
        }
    });

    function checkAnswer() {
        const userAnswer = answerInput.value.trim().toLowerCase();
        if (userAnswer === correctAnswer.toLowerCase()) {
            score++;
            localStorage.setItem("score", score);
            scoreDisplay.textContent = `Score: ${score}`;
            resultDisplay.textContent = "Correct Answer!";
            resultDisplay.style.color = "green";
            localStorage.setItem("lastSubmissionDate", new Date().toDateString());
            answerInput.disabled = true;
            
        } else {
            score = 0;
            localStorage.setItem("score", score);
            scoreDisplay.textContent = `Score: ${score}`;
            resultDisplay.textContent = "Incorrect Answer!";
            resultDisplay.style.color = "red";
            localStorage.setItem("lastSubmissionDate", new Date().toDateString());
            answerInput.disabled = true;
        }
    }

});
