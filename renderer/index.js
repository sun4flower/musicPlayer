const { ipcRenderer } = require('electron')
const { $ ,convertDuration} = require("./helper")
const musicAudio=new Audio();
let allTracks;
let currentTrack;

$('addMusic').addEventListener('click',()=>{
    ipcRenderer.send("addMusic")
})
const renderListHtml=(tracks)=>{
    tracks.unshift([])
    const tracksList=$('trackList');
    var htmls="";
    const trackListHtml=tracks.reduce((html,track,currentIndex)=>{
        htmls+=`<li class='row music-track list-group-item d-flex justify-content-between align-items-center'>
            <div class="col-10">
                <b>${track.fileName}</b>
            </div>
            <div class="col-2">
                <span class="fa-play" class="pointer"  id="fa-play" data-id="${track.id}"></span>
                <span class="fa-trash" mr-40 class="pointer" data-id="${track.id}" id="delete">删除</span>
               
            </div>
        </li>`
        
        return htmls;
    })
    const emptyTrackHtml=`<div class='alert alert-primary'>还没有添加任何音乐</div>`
    trackList.innerHTML=tracks.length>1?`<ul class='list-group'>${trackListHtml}</ul>`:emptyTrackHtml
}
const renderPlayHtml=(name,duration)=>{
    const player=$("play-status")
    const html=`<div class="col font-weight-bold">正在播放：${name}</div>
            <div class="col">
            <span id="current-seeker">00:00</span>/${duration}
            </div>
    `
    player.innerHTML=html;
    

}
const updateProgress=(current,duration)=>{
    const seeker=$("current-seeker")
    seeker.innerHTML=convertDuration(current)
    const progress=$("progress")
    progress.innerHTML=Math.floor(current/duration*100) +"%"
    progress.style.width=Math.floor(current/duration*100) +"%"

}
ipcRenderer.on('getTracks',(event,tracks)=>{
    allTracks=tracks;
    renderListHtml(tracks)
})
musicAudio.addEventListener("loadedmetadata",()=>{
    renderPlayHtml(currentTrack.fileName,convertDuration(musicAudio.duration))
    
    //开始渲染播放器

})
musicAudio.addEventListener('timeupdate',()=>{
    updateProgress(musicAudio.currentTime,musicAudio.duration)
})
$("trackList").addEventListener('click',events=>{
    events.preventDefault()
    const {dataset,classList} = events.target;
    const id = dataset&&dataset.id;
    if(id && classList.contains('fa-play')){
        if(currentTrack&&currentTrack.id===id){
            musicAudio.play()
        }else{
            const progress=$("progress")
            progress.innerHTML="0%"
            progress.style.width="0%"
            currentTrack=allTracks.find(track=>{
                return track.id===id
             })
             musicAudio.src=currentTrack.path;
             musicAudio.play()
             const resetIcon=document.querySelector(".fa-stop")
             if(resetIcon){
                resetIcon.classList.replace('fa-stop','fa-play')
             }
        }
        classList.replace('fa-play','fa-stop')
    }else if(id && classList.contains('fa-stop')){
         musicAudio.pause()
         classList.replace('fa-stop','fa-play')
    }else if(id && classList.contains('fa-trash')){
        ipcRenderer.send('deleteTrack',id)
    }
})