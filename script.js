const songs = [
  {
    title: "Eternal Flow",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Night Drive",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=500&q=80"
  },
  {
    title: "Dreamscape",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=500&q=80"
  }
];

const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const title = document.getElementById("title");
const artist = document.getElementById("artist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const muteBtn = document.getElementById("mute");
const volume = document.getElementById("volume");
const speed = document.getElementById("speed");
const progress = document.getElementById("progress");
const progressBox = document.getElementById("progress-box");
const playlist = document.getElementById("playlist");
const theme = document.getElementById("theme");
const player = document.querySelector(".player");

let index = 0;
let playing = false;
let shuffle = false;
let repeat = false;

function loadSong(i) {
  const song = songs[i];
  title.textContent = song.title;
  artist.textContent = song.artist;
  cover.src = song.cover;
  audio.src = song.src;
  updatePlaylist();
}

function playSong() {
  audio.play();
  playing = true;
  playBtn.textContent = "⏸";
  player.classList.add("playing");
}

function pauseSong() {
  audio.pause();
  playing = false;
  playBtn.textContent = "▶";
  player.classList.remove("playing");
}

playBtn.onclick = () => (playing ? pauseSong() : playSong());

prevBtn.onclick = () => {
  index = (index - 1 + songs.length) % songs.length;
  loadSong(index);
  playSong();
};

nextBtn.onclick = () => {
  index = shuffle
    ? Math.floor(Math.random() * songs.length)
    : (index + 1) % songs.length;
  loadSong(index);
  playSong();
};

shuffleBtn.onclick = () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active");
};

repeatBtn.onclick = () => {
  repeat = !repeat;
  repeatBtn.classList.toggle("active");
};

audio.onended = () => (repeat ? playSong() : nextBtn.click());

progressBox.onclick = e => {
  audio.currentTime = (e.offsetX / progressBox.clientWidth) * audio.duration;
};

volume.oninput = () => (audio.volume = volume.value);
muteBtn.onclick = () => (audio.muted = !audio.muted);
speed.onchange = () => (audio.playbackRate = speed.value);

function updatePlaylist() {
  playlist.innerHTML = "";
  songs.forEach((song, i) => {
    const li = document.createElement("li");
    li.textContent = `${song.title} - ${song.artist}`;
    if (i === index) li.classList.add("active");
    li.onclick = () => {
      index = i;
      loadSong(i);
      playSong();
    };
    playlist.appendChild(li);
  });
}

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

audio.onloadedmetadata = () => {
  document.getElementById("duration").textContent = formatTime(audio.duration);
};

audio.ontimeupdate = () => {
  document.getElementById("current").textContent = formatTime(audio.currentTime);
  progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
};

loadSong(index);
volume.value = 0.7;
audio.volume = 0.7;