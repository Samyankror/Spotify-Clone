let currSong=new Audio();
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
  currFolder=folder;
  let a=await fetch(`/${folder}/`);
  let response = await a.text();
   

    let div=document.createElement('div');
    div.innerHTML=response;
    let as=div.getElementsByTagName('a');
    
     songs=[];
    for(let index=0;index<as.length;index++){
       const element=as[index];
       
       if(element.href.endsWith('.mp3')){
        songs.push(element.href.split(`/${folder}/`)[1]);
       }
    }

    let songUl=document.querySelector('.song-list');
    songUl.innerHTML="";
  for (const song of songs){
    songUl.innerHTML=songUl.innerHTML+`<li><img  width="34" src="img/music.svg" alt="" >
                                       <div class="info">
                                <div> ${song.replaceAll("%20", " ")}</div>
                                
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img  src="img/play.svg" alt="" >
                            </div> </li>`;
  }
  

  Array.from(document.querySelector('.song-list').getElementsByTagName('li')).forEach(e=>{
    e.addEventListener('click',element=>{
       playMusic(e.querySelector('.info').firstElementChild.innerHTML.trim());
    });
  });
  
    return songs;
}


function playMusic(track,pause=false){
      
     currSong.src=`${currFolder}/${track}`;
     if(!pause){
     currSong.play();
     play.src="img/pause.svg";
     }
     document.querySelector('.song-info').innerHTML=decodeURI(track);
     document.querySelector('.song-time').innerHTML="00/00";
}

      async function displayAlbums(){
      let a=await fetch(`/songs/`); 
      let response = await a.text();
       let div=document.createElement("div");
       div.innerHTML=response;
       let anchors=div.getElementsByTagName("a");
       let playlistCard=document.querySelector(".playlist-card");
       let array = Array.from(anchors);
       for(let index=0;index<array.length;index++){
         const e=array[index];
           if(e.href.includes("/songs/")){
            let folder=e.href.split("/").slice(-1)[0];
            let b=await fetch(`/songs/${folder}/info.json`);
            let result=await b.json();
          
            playlistCard.innerHTML=playlistCard.innerHTML+ ` <div data-folder="${folder}" class="card-container">
            <div class="card-img-container">
            <img src="/songs/${folder}/cover.jpg" alt="Aujla Hits" class="playlist-image">
            <div class="play-button">
                <img src="img/play-stroke-rounded.svg" alt="Play">
            </div>
            </div>
        
        <h3>${result.title}</h3>
        <p>${result.description}</p>
    </div>`
           }
       }
       Array.from(document.getElementsByClassName('card-container')).forEach(e=>{
        e.addEventListener('click',async item=>{
          songs =await getSongs(`songs/${item.currentTarget.dataset.folder}`);  
          playMusic(songs[0]);
        });
});



}
async function main(){
    await getSongs("songs/Diljit");
  playMusic(songs[0],true);

  await displayAlbums();
  
  //Play button logic
  play.addEventListener('click',e=>{
    if(currSong.paused){
      currSong.play();
      play.src="img/pause.svg";
    }
    else{
      currSong.pause();
      play.src="img/play.svg";
    }
  });
    
  // update the time of song
    currSong.addEventListener("timeupdate",e=>{
      document.querySelector('.song-time').innerHTML=`${secondsToMinutesSeconds(currSong.currentTime)} / ${secondsToMinutesSeconds(currSong.duration)}`;
      document.querySelector('.circle').style.left=(currSong.currentTime/currSong.duration)*100+"%";

    });

    // adjust the seekbar acc to song time
    document.querySelector('.seekbar').addEventListener('click',(e)=>{
          let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
           document.querySelector(".circle").style.left = percent + "%";
           currSong.currentTime=(currSong.duration*percent)/100;
    });
      
    document.querySelector('#ham').addEventListener('click',e=>{
      document.querySelector('.sidebar').style.left=0;
    });

    document.querySelector('.close').addEventListener('click',e=>{
      document.querySelector('.sidebar').style.left='-130%';
    });

     //add an eventlistener on previous to play the previous song
    previous.addEventListener('click',()=>{
     currSong.pause();
     let index=songs.indexOf(currSong.src.split('/').slice(-1)[0]);
     if(index-1>=0){
      playMusic(songs[index-1]);
     }
     else{
      currSong.play();
     }
    });

   //add an eventlistener on next to play the next song
    next.addEventListener('click',()=>{
      currSong.pause();
      let index=songs.indexOf(currSong.src.split('/').slice(-1)[0]);
      if(index+1<songs.length){
       playMusic(songs[index+1]);
      }
      else{
       currSong.play();
      }
    });

    //add an eventlistener to change the volume
    document.querySelector('.range').getElementsByTagName('input')[0].addEventListener('change',(e)=>{
      currSong.volume=(e.target.value)/100;
    });

    // add an eventlistener to mute the track
    document.querySelector(".volume>img").addEventListener('click',e=>{
      if(e.target.src.includes("volume.svg")){
        e.target.src= e.target.src.replace("volume.svg","mute.svg");
        currSong.volume=0;
        document.querySelector('.range').getElementsByTagName('input')[0].value=0;
      }
      else{
        e.target.src= e.target.src.replace("mute.svg","volume.svg");
        currSong.volume=0.5;
        document.querySelector('.range').getElementsByTagName('input')[0].value=50;
      }
    });
}
 main();

