const songs = [
  { title: "Dreams", artist: "Aurora", src: "songs/song1.mp3", cover: "images/cover1.jpg" },
  { title: "Night Ride", artist: "Aurora", src: "songs/song2.mp3", cover: "images/cover2.jpg" },
  { title: "Sunrise", artist: "Aurora", src: "songs/song3.mp3", cover: "images/cover3.jpg" }
];

const $ = id => document.getElementById(id);

const audio = $("audio"),
      cover = $("cover"),
      title = $("song-title"),
      artist = $("song-artist");

const playBtn = $("play"),
      prev = $("prev"),
      next = $("next");

const progress = $("progress"),
      box = $("progress-box");

const vol = $("volume"),
      mute = $("mute"),
      speed = $("speed");

const shuffleBtn = $("shuffle"),
      repeatBtn = $("repeat"),
      favBtn = $("fav");

const list = $("playlist"),
      theme = $("theme"),
      body = document.body;

let index = +localStorage.song || 0;
let playing = false, shuffle = false, repeat = 0;

function load(i) {
  const s = songs[i];
  title.textContent = s.title;
  artist.textContent = s.artist;
  cover.src = s.cover;
  audio.src = s.src;
  updateList();
  localStorage.song = i;
}

function play() {
  audio.play();
  playing = true;
  playBtn.textContent = "⏸";
  body.classList.add("playing");
}

function pause() {
  audio.pause();
  playing = false;
  playBtn.textContent = "▶";
  body.classList.remove("playing");
}

playBtn.onclick = () => playing ? pause() : play();
prev.onclick = () => change(-1);
next.onclick = () => change(1);

function change(step) {
  if (shuffle) index = Math.floor(Math.random() * songs.length);
  else index = (index + step + songs.length) % songs.length;
  load(index);
  play();
}

audio.ontimeupdate = () => {
  if (audio.duration) {
    progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
  }
};

box.onclick = e => {
  audio.currentTime = (e.offsetX / box.clientWidth) * audio.duration;
};

audio.onended = () => repeat === 1 ? play() : change(1);

vol.oninput = () => {
  audio.volume = vol.value;
  localStorage.vol = vol.value;
};

mute.onclick = () => audio.muted = !audio.muted;
speed.onchange = () => audio.playbackRate = speed.value;

shuffleBtn.onclick = () => {
  shuffle = !shuffle;
  shuffleBtn.classList.toggle("active", shuffle);
};

repeatBtn.onclick = () => {
  repeat = (repeat + 1) % 3;
  repeatBtn.textContent = ["🔁", "🔂", "❌"][repeat];
};

theme.onclick = () => {
  body.classList.toggle("light");
  localStorage.theme = body.classList.contains("light");
};

function updateList() {
  list.innerHTML = "";
  songs.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = s.title;
    if (i === index) li.classList.add("active");
    li.onclick = () => { index = i; load(i); play(); };
    list.appendChild(li);
  });
}

document.onkeydown = e => {
  if (e.code === "Space") { e.preventDefault(); playBtn.click(); }
  if (e.code === "ArrowRight") next.click();
  if (e.code === "ArrowLeft") prev.click();
};

load(index);
vol.value = localStorage.vol || 0.7;
audio.volume = vol.value;
if (localStorage.theme === "true") body.classList.add("light");