//lets select all required tags or element
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");





let musicIndex = 1;


window.addEventListener("load", () => {
    loadMusic(musicIndex);//calling load music function once window loaded
})
// load music function
function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `${allMusic[indexNumb - 1].src}.mp3`;

}
// play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();

}
// pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
//next music function
function nextMusic() {
    // here we will just increment of index by 1
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}
//prev music function
function previousMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}
//play or music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if music paused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
});

nextBtn.addEventListener("click", () => {
    nextMusic();//calling this function will let you shift to the next music
});

prevBtn.addEventListener("click", () => {
    previousMusic();
});
// update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;// getting current time of song
    const duration = e.target.duration;// getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        //update song total duration 
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;//adding 0 if sec is less than 10
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;//adding 0 if sec is less than 10
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
//let's update playing song current time on according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth;//getting width of progress bar
    let clickedoffSetX = e.offsetX;// getting offset x value
    let songDuration = mainAudio.duration;//getting song total duration

    mainAudio.currentTime = (clickedoffSetX / progressWidthval) * songDuration;
    playMusic();
});
//let's work on repeat, shuffle song according to icon

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // first  we get the innerText of the icon then we will change accordingly
    let getText = repeatBtn.innerText;//getting innerText of icon
    //let's do different changes of different icon click using switch
    switch (getText) {
        case "repeat":  //if this icon is repeat
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": // if icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;

    }
});
//above we just changed the icon, now let's work on what to do 
// after the song ended
mainAudio.addEventListener("ended", () => {
    // we will do according to the icon means if user has set icon to loop song then we will repeat
    //the current song and will do further accordingly
    let getText = repeatBtn.innerText;//getting innerText of icon
    //let's do different changes of different icon click using switch
    switch (getText) {
        case "repeat":  //if this icon is repeat then simply we call the nextMusic function so the next song will play
            nextMusic();
            break;
        case "repeat_one": // if icon is repeat_one then we will change the current playing song current time to 0 so song will play from beigning
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {

                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex);// this loop run until the next random number won't be the same or 
            musicIndex = randIndex;// passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex);// calling load music function
            playMusic();//calling playmusic function
            break;
    }
});


showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");

});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();

});
const ulTag = wrapper.querySelector("ul");
// let's create li according to the array length
for (let i = 0; i < allMusic.length; i++) {

    let liTag = ` <li li-index ="${i+1}">
    <div class="row">
        <span>${allMusic[i].name} </span>
        <p>${allMusic[i].artist}</p>
    </div>
    <audio class ="${allMusic[i].src}" src = "music/${allMusic[i].src}.mp3"></audio>
    <span id = "${allMusic[i].src}" class="audio-duration">3:40</span>
</li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;//adding 0 if sec is less than 10
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;

    });
}
//let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
for (let j = 0; j < allLiTags.length; j++) {
    // if there is an li tag which li-index is equal to musicIndex
    // then this music is playing now and we will style it
    if (allLiTags[j].getAttribute("li-index") == musicIndex) {
        allLiTags[j].classList.add("playing");
    }
    allLiTags[j].setAttribute("onclick", "clicked(this)");
}
//lets play song on li click
function clicked(element) {
    //getting li index of a particular cliked li tag
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;//passing that li index to musicIndex
    loadMusic(musicIndex);
    playMusic();
}




