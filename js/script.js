console.log("Lets write java script ");
let currentsong = new Audio();
let currentfolder;

let songs;


function secondsToMinutesSeconds(seconds) {
    // Check if input is a valid number
    if (isNaN(seconds) || !isFinite(seconds)) {
        return "00:00";
    }

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;
    var remainingSecondsFixed = remainingSeconds.toFixed(2); // Limit to 2 decimal places

    // Extract integer and fractional parts
    var [integerPart, fractionalPart] = remainingSecondsFixed.split('.');

    // Add leading zero if necessary
    var minutesString = (minutes < 10) ? "0" + minutes : minutes;
    var secondsString = (integerPart < 10) ? "0" + integerPart : integerPart;

    return minutesString + ":" + secondsString;
}

// Example usage
console.log(secondsToMinutesSeconds(12.345));   // Output: "00:12"
console.log(secondsToMinutesSeconds(75.6789));  // Output: "01:15"
console.log(secondsToMinutesSeconds(3600.01));  // Output: "60:00"
console.log(secondsToMinutesSeconds("invalid")); // Output: "Invalid input"
console.log(secondsToMinutesSeconds(NaN));       // Output: "Invalid input"


// Example usage
console.log(secondsToMinutesSeconds(12.345));   // Output: "00:12"
console.log(secondsToMinutesSeconds(75.6789));  // Output: "01:15"
console.log(secondsToMinutesSeconds(3600.01));  // Output: "60:00"




async function getsongs(folder) {
    currentfolder = folder;

    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }


    }

    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUl.innerHTML = ""
    for (const song of songs) {
        songUl.innerHTML += `<li> 
            <img class="invert" width="34" src="image/music.svg" alt="">
            <div class="info">
                <div>${song.replaceAll("%20", " ")}</div>
                <div>Sarab</div>
            </div>
            <div class="playnow">
                <img src="image/play.svg" alt="">
                <span>Play Now</span>
            </div>
         </li>`;
    }
    

    //attach an event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })



return songs


}
const playMusic = (track, pause = false) => {
    // let audio= new Audio("/songs/" + track)
    currentsong.src = `/${currentfolder}/` + track
    if (!pause) {
        currentsong.play()
        play.src = "image/pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"



}
async function displayalbums(){
    let a = await fetch(`/songs/`);
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        
        if(e.href.includes("/songs")){
         let folder =   e.href.split("/").slice(-2)[0]
         // get the meta data of all the folder
         let a = await fetch(`/songs/${folder}/info.json`);
         let response = await a.json();
         console.log(response)
         cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder="${folder}"  class="card">
         <div class="play">

             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30">
                 <path
                     d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                     stroke="black" stroke-width="1.5" stroke-linejoin="round" />
             </svg>

         </div>
         <img src="/songs/${folder}/cover.jpg" alt="">
         <h2>${response.title}</h2>
         <p>${response.description}</p>

     </div>`
        }
    }
    
    //Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            console.log(item.target, item.currentTarget.dataset)
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })


    
}
async function main() {


    await getsongs("songs/ncs")
    playMusic(songs[0], true)


    // Display  all the albyms on the page 
    displayalbums()






    //attach an event listener to play ,next and previous
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "image/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "image/play.svg"
        }
    })
    //listen for timeupdate event 
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/ ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";


    })
    //add an event listner to seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100

    })
    //add an event listner to open the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    //add event lister for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    // add an event listener to previous and next svg's
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("previous clicked")
        console.log(currentsong.src)
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])


        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])

        }



    })
    // add an event listener to previous and next svg's
    next.addEventListener("click", () => {
        currentsong.pause()

        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])



        if ((index + 1) <= songs.length - 1) {
            playMusic(songs[index + 1])

        }


    })
    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to ", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100
        if(currentsong.volume > 0){
           document.querySelector(".volume>img").src =      document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        } 
    })






    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target)
        if (e.target.src.includes("image/volume.svg")) {
            e.target.src = e.target.src.replace("image/volume.svg", "image/mute.svg");
            // Set volume to 0 to mute
            currentsong.volume = 0;
        } else {
            e.target.src = e.target.src.replace("image/mute.svg", "image/volume.svg");
            // Reset volume to previous value (or desired value)
            currentsong.volume = parseFloat(document.querySelector(".range").getElementsByTagName("input")[0].value) / 100;
        }
    });
    


}






main()
