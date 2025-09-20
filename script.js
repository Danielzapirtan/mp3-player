const audioPlayer = document.getElementById('audioPlayer');
const fileInput = document.getElementById('fileInput');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playlistEl = document.getElementById('playlist');

let playlist = [];
let currentTrackIndex = 0;
let isPlaying = false;

fileInput.addEventListener('change', handleFiles);
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrevious);
nextBtn.addEventListener('click', playNext);
audioPlayer.addEventListener('timeupdate', updateProgress);
progressBar.addEventListener('input', seek);
audioPlayer.addEventListener('ended', playNext);

function handleFiles(event) {
    playlist = Array.from(event.target.files);
    currentTrackIndex = 0;
    updatePlaylist();
    if (playlist.length > 0) {
        loadTrack(currentTrackIndex);
    }
}

function updatePlaylist() {
    playlistEl.innerHTML = '';
    playlist.forEach((file, index) => {
        const li = document.createElement('li');
        li.textContent = file.name;
        li.addEventListener('click', () => {
            currentTrackIndex = index;
            loadTrack(currentTrackIndex);
            togglePlayPause();
        });
        if (index === currentTrackIndex) {
            li.classList.add('active');
        }
        playlistEl.appendChild(li);
    });
    updateButtons();
}

function loadTrack(index) {
    const file = playlist[index];
    audioPlayer.src = URL.createObjectURL(file);
    updatePlaylist();
}

function togglePlayPause() {
    if (isPlaying) {
        audioPlayer.pause();
        playPauseBtn.textContent = 'Play';
    } else {
        audioPlayer.play();
        playPauseBtn.textContent = 'Pause';
    }
    isPlaying = !isPlaying;
}

function playPrevious() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        loadTrack(currentTrackIndex);
        togglePlayPause();
    }
}

function playNext() {
    if (currentTrackIndex < playlist.length - 1) {
        currentTrackIndex++;
        loadTrack(currentTrackIndex);
        togglePlayPause();
    } else {
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.textContent = 'Play';
    }
}

function updateProgress() {
    const { currentTime, duration } = audioPlayer;
    progressBar.value = (currentTime / duration) * 100 || 0;
    currentTimeEl.textContent = formatTime(currentTime);
    durationEl.textContent = formatTime(duration);
}

function seek() {
    const seekTime = (progressBar.value / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateButtons() {
    prevBtn.disabled = currentTrackIndex === 0;
    nextBtn.disabled = currentTrackIndex === playlist.length - 1;
}

// Register service worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed:', err));
    });
}