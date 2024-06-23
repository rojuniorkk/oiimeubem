const _player = {
    musica: new Audio("./assets/audio/musica.mp3"),
    isPlaying: false,
};

_player.musica.volume = 0.15;

function volume(input) {
    _player.musica.volume = input.value;
}

function status(element = null) {
    if (element != null) {
         var newS = _player.isPlaying === false ? "bi-play-fill" : "bi-pause";
         var oldS = _player.isPlaying === true ? "bi-play-fill" : "bi-pause";

         element.classList.replace(newS, oldS);
    }

    _player.isPlaying = !_player.isPlaying;
    _player.isPlaying === true
         ? _player.musica.play()
         : _player.musica.pause();
}