/**
 * REPRODUCTOR DE MÚSICA PARA GUAYAS DIGITAL
 * Versión: 1.0
 * Autor: GuayasDigital
 * Descripción: Reproductor de música automático que lee archivos MP4 desde ContEstatico/Musica
 */

class MusicPlayer {
    constructor() {
        this.playlist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.originalPlaylist = [];
        this.volume = 0.5;

        // Referencias a elementos DOM
        this.audioPlayer = document.getElementById('audio-player');
        this.playPauseBtn = document.getElementById('play-pause-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.shuffleBtn = document.getElementById('shuffle-btn');
        this.volumeBtn = document.getElementById('volume-btn');
        this.volumeSlider = document.getElementById('volume-slider');
        this.currentSongDiv = document.getElementById('current-song');

        this.initializePlayer();
        this.loadPlaylist();
    }

    /**
     * Intenta reproducción automática manejando políticas del navegador
     */
    async tryAutoplay() {
        try {
            console.log('🔥 Intentando autoplay...');
            await this.play();
        } catch (error) {
            console.warn('⚠️ Autoplay bloqueado por el navegador:', error.message);
            console.log('👆 Haz click en el botón play para iniciar la música');
            this.showMessage('Haz click en ▶️ para iniciar la música');

            // Cambiar el texto del botón para indicar que está listo
            this.playPauseBtn.style.animation = 'pulse 1.5s infinite';
        }
    }

    /**
     * Inicializa los event listeners y configuración inicial del reproductor
     */
    initializePlayer() {
        console.log('🚀 Inicializando reproductor de música...');

        if (!this.audioPlayer) {
            console.error('❌ Elemento audio-player no encontrado');
            return;
        }

        console.log('✅ Elementos encontrados:', {
            audioPlayer: !!this.audioPlayer,
            playPauseBtn: !!this.playPauseBtn,
            prevBtn: !!this.prevBtn,
            nextBtn: !!this.nextBtn,
            shuffleBtn: !!this.shuffleBtn,
            volumeBtn: !!this.volumeBtn,
            volumeSlider: !!this.volumeSlider,
            currentSongDiv: !!this.currentSongDiv
        });

        // Event listeners para controles
        this.playPauseBtn.addEventListener('click', () => {
            console.log('🖱️ Click en play/pause');
            this.playPauseBtn.style.animation = ''; // Remover animación de pulso
            this.togglePlayPause();
        });

        this.prevBtn.addEventListener('click', () => {
            console.log('🖱️ Click en anterior');
            this.previousSong();
        });

        this.nextBtn.addEventListener('click', () => {
            console.log('🖱️ Click en siguiente');
            this.nextSong();
        });

        this.shuffleBtn.addEventListener('click', () => {
            console.log('🖱️ Click en shuffle');
            this.toggleShuffle();
        });

        // Botón de debug temporal
        const debugBtn = document.getElementById('debug-btn');
        if (debugBtn) {
            debugBtn.addEventListener('click', () => {
                console.log('🐛 DEBUG INFO:');
                console.log('- Playlist:', this.playlist);
                console.log('- Current index:', this.currentIndex);
                console.log('- Audio element:', this.audioPlayer);
                console.log('- Audio src:', this.audioPlayer.src);
                console.log('- Audio paused:', this.audioPlayer.paused);
                console.log('- Audio muted:', this.audioPlayer.muted);
                console.log('- Audio volume:', this.audioPlayer.volume);
                console.log('- Audio readyState:', this.audioPlayer.readyState);
                console.log('- Audio networkState:', this.audioPlayer.networkState);
                console.log('- Audio duration:', this.audioPlayer.duration);
                console.log('- Audio currentTime:', this.audioPlayer.currentTime);
                console.log('- IsPlaying flag:', this.isPlaying);

                // Intentar cargar la primera canción manualmente
                if (this.playlist.length > 0) {
                    console.log('🔧 Intentando cargar primera canción manualmente...');
                    this.audioPlayer.src = this.playlist[0];
                    this.audioPlayer.load();
                }
            });
        }

        // Control de volumen
        this.volumeSlider.addEventListener('input', (e) => {
            console.log('🔊 Cambio de volumen:', e.target.value);
            this.setVolume(e.target.value / 100);
        });

        this.volumeBtn.addEventListener('click', () => {
            console.log('🖱️ Click en mute/unmute');
            this.toggleMute();
        });

        // Eventos del elemento audio
        this.audioPlayer.addEventListener('ended', () => {
            console.log('🔚 Canción terminada, pasando a la siguiente');
            this.nextSong();
        });

        this.audioPlayer.addEventListener('loadedmetadata', () => {
            console.log('📊 Metadata cargada para:', this.audioPlayer.src);
            console.log('- Duración:', this.audioPlayer.duration);
            console.log('- ReadyState:', this.audioPlayer.readyState);
            this.updateCurrentSong();
        });

        this.audioPlayer.addEventListener('error', (e) => {
            console.error('❌ Error en elemento audio:', e);
            console.log('🔧 Detalles del error:', {
                error: e.target.error,
                networkState: e.target.networkState,
                readyState: e.target.readyState,
                src: e.target.src
            });
            this.handleAudioError();
        });

        this.audioPlayer.addEventListener('canplay', () => {
            console.log('✅ Audio listo para reproducir');
            this.removeLoadingState();
        });

        this.audioPlayer.addEventListener('loadstart', () => {
            console.log('⏳ Iniciando carga de audio');
            this.addLoadingState();
        });

        this.audioPlayer.addEventListener('play', () => {
            console.log('▶️ Evento play disparado');
        });

        this.audioPlayer.addEventListener('pause', () => {
            console.log('⏸️ Evento pause disparado');
        });

        // Configuración inicial
        this.setVolume(this.volume);

        console.log('✅ Reproductor inicializado correctamente');
    }

    /**
     * Carga la playlist desde el servidor
     */
    async loadPlaylist() {
        try {
            console.log('🎵 Iniciando carga de playlist...');
            this.addLoadingState();

            const playlistUrl = this.getPlaylistUrl();
            console.log('🔗 URL de playlist:', playlistUrl);

            const response = await fetch(playlistUrl);
            console.log('📡 Respuesta del servidor:', response.status, response.statusText);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('📦 Datos recibidos del servidor:', data);

            // Resolver rutas con ~ al formato correcto para el navegador
            this.playlist = (data || []).map(path => {
                let resolvedPath = path;
                if (path.startsWith('~/')) {
                    resolvedPath = path.replace('~/', '/');
                }
                console.log(`🔄 Ruta original: ${path} -> Ruta resuelta: ${resolvedPath}`);
                return resolvedPath;
            });

            this.originalPlaylist = [...this.playlist];

            console.log('✅ Playlist procesada y lista:', this.playlist);
            console.log('📊 Total de canciones:', this.playlist.length);

            if (this.playlist.length > 0) {
                console.log('🎶 Cargando primera canción...');
                this.loadSong(0);
                this.updateCurrentSong();

                // Intentar reproducción automática (puede fallar por políticas del navegador)
                setTimeout(() => {
                    console.log('🔥 Intentando reproducción automática...');
                    this.tryAutoplay();
                }, 1000);

            } else {
                console.warn('⚠️ No se encontraron canciones');
                this.showMessage('No se encontraron canciones en Content/Musica');
            }
        } catch (error) {
            console.error('❌ Error cargando playlist:', error);
            this.showMessage('Error cargando canciones del servidor');
        } finally {
            this.removeLoadingState();
        }
    }

    /**
     * Construye la URL del endpoint de playlist
     */
    getPlaylistUrl() {
        const baseUrl = window.location.origin;
        const currentPath = window.location.pathname;

        // Detectar si estamos en un subdirectorio
        const pathParts = currentPath.split('/').filter(part => part);
        const basePath = pathParts.length > 0 && pathParts[0] !== 'Home' ? '/' + pathParts[0] : '';

        return `${baseUrl}${basePath}/Home/GetPlaylist`;
    }

    /**
     * Carga una canción específica por índice
     */
    loadSong(index) {
        if (index >= 0 && index < this.playlist.length) {
            const songPath = this.playlist[index];
            console.log(`🎵 Cargando canción ${index + 1}/${this.playlist.length}:`, songPath);

            // Verificar que la ruta no tenga ~ antes de asignar
            let finalPath = songPath;
            if (songPath.startsWith('~/')) {
                finalPath = songPath.replace('~/', '/');
                console.log(`🔧 Corrigiendo ruta: ${songPath} -> ${finalPath}`);
            }

            this.currentIndex = index;
            this.audioPlayer.src = finalPath;
            console.log(`✅ Audio src configurado como: ${this.audioPlayer.src}`);
            this.updateCurrentSong();
        } else {
            console.warn('⚠️ Índice de canción inválido:', index);
        }
    }

    /**
     * Actualiza la información de la canción actual en la UI
     */
    updateCurrentSong() {
        if (this.playlist.length > 0 && this.currentSongDiv) {
            const songPath = this.playlist[this.currentIndex];
            const songName = this.extractSongName(songPath);
            const displayText = `${this.currentIndex + 1}/${this.playlist.length}: ${songName}`;

            this.currentSongDiv.textContent = displayText;
            this.currentSongDiv.title = songName; // Tooltip con nombre completo
        }
    }

    /**
     * Extrae el nombre de la canción desde la ruta
     */
    extractSongName(songPath) {
        return songPath.split('/').pop()
            .replace(/\.mp[34]/i, '') // Removes .mp3 or .mp4 (case-insensitive)
            .replace(/[_-]/g, ' ');
    }

    /**
     * Alternar entre reproducir y pausar
     */
    togglePlayPause() {
        console.log('🔄 togglePlayPause llamado');
        console.log('- Audio src:', this.audioPlayer.src);
        console.log('- Audio paused:', this.audioPlayer.paused);
        console.log('- Audio readyState:', this.audioPlayer.readyState);
        console.log('- Audio networkState:', this.audioPlayer.networkState);

        if (!this.audioPlayer.src) {
            console.warn('⚠️ No hay src configurado');
            return;
        }

        if (this.audioPlayer.paused) {
            console.log('▶️ Audio está pausado, intentando reproducir...');
            this.play();
        } else {
            console.log('⏸️ Audio está reproduciéndose, pausando...');
            this.pause();
        }
    }

    /**
     * Reproducir música
     */
    async play() {
        try {
            console.log('▶️ Intentando reproducir:', this.audioPlayer.src);

            if (!this.audioPlayer.src) {
                console.warn('⚠️ No hay src en el elemento audio');
                return;
            }

            const playPromise = this.audioPlayer.play();

            if (playPromise !== undefined) {
                await playPromise;
                console.log('✅ Reproducción iniciada exitosamente');
                this.playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
                this.playPauseBtn.style.animation = ''; // Remover animación
                this.isPlaying = true;
                this.showMessage(''); // Limpiar mensaje de "haz click"
            }
        } catch (error) {
            console.error('❌ Error al reproducir:', error);
            console.log('🔧 Detalles del error:', {
                name: error.name,
                message: error.message,
                code: error.code
            });

            // Si es error de autoplay, mostrar mensaje amigable
            if (error.name === 'NotAllowedError') {
                this.showMessage('Haz click en ▶️ para iniciar la música');
                this.playPauseBtn.style.animation = 'pulse 1.5s infinite';
            } else {
                this.handleAudioError();
            }

            throw error; // Re-lanzar para que site.js pueda manejarlo
        }
    }

    /**
     * Pausar música
     */
    pause() {
        this.audioPlayer.pause();
        this.playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
        this.isPlaying = false;
    }

    /**
     * Siguiente canción
     */
    nextSong() {
        if (this.playlist.length === 0) return;

        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.loadSong(this.currentIndex);

        if (this.isPlaying) {
            // Pequeño delay para asegurar que el archivo se carga
            setTimeout(() => {
                this.play();
            }, 100);
        }
    }

    /**
     * Canción anterior
     */
    previousSong() {
        if (this.playlist.length === 0) return;

        this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.playlist.length - 1;
        this.loadSong(this.currentIndex);

        if (this.isPlaying) {
            setTimeout(() => {
                this.play();
            }, 100);
        }
    }

    /**
     * Alternar modo aleatorio (shuffle)
     */
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;

        if (this.isShuffled) {
            this.activateShuffle();
        } else {
            this.deactivateShuffle();
        }

        this.updateCurrentSong();
        console.log('Shuffle:', this.isShuffled ? 'activado' : 'desactivado');
    }

    /**
     * Activar modo aleatorio
     */
    activateShuffle() {
        this.shuffleBtn.classList.add('btn-success');
        this.shuffleBtn.classList.remove('btn-outline-secondary');

        // Guardar canción actual
        const currentSong = this.playlist[this.currentIndex];

        // Crear playlist mezclada
        this.playlist = this.shuffleArray([...this.originalPlaylist]);

        // Encontrar la nueva posición de la canción actual
        this.currentIndex = this.playlist.indexOf(currentSong);
        if (this.currentIndex === -1) this.currentIndex = 0;
    }

    /**
     * Desactivar modo aleatorio
     */
    deactivateShuffle() {
        this.shuffleBtn.classList.remove('btn-success');
        this.shuffleBtn.classList.add('btn-outline-secondary');

        // Guardar canción actual
        const currentSong = this.playlist[this.currentIndex];

        // Restaurar playlist original
        this.playlist = [...this.originalPlaylist];

        // Encontrar la posición en la playlist original
        this.currentIndex = this.playlist.indexOf(currentSong);
        if (this.currentIndex === -1) this.currentIndex = 0;
    }

    /**
     * Mezclar array usando algoritmo Fisher-Yates
     */
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * Alternar mute/unmute
     */
    toggleMute() {
        this.audioPlayer.muted = !this.audioPlayer.muted;

        if (this.audioPlayer.muted) {
            this.volumeBtn.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
        } else {
            this.volumeBtn.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
        }
    }

    /**
     * Establecer volumen
     */
    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        this.audioPlayer.volume = this.volume;
        this.volumeSlider.value = this.volume * 100;
    }

    /**
     * Manejar errores de audio
     */
    handleAudioError() {
        console.warn(`Error cargando: ${this.playlist[this.currentIndex]}`);

        // Intentar siguiente canción si hay error
        if (this.playlist.length > 1) {
            setTimeout(() => {
                this.nextSong();
            }, 1000);
        } else {
            this.showMessage('Error reproduciendo archivo de audio');
        }
    }

    /**
     * Mostrar mensaje en la UI
     */
    showMessage(message) {
        if (this.currentSongDiv) {
            this.currentSongDiv.textContent = message;
        }
    }

    /**
     * Agregar estado de carga
     */
    addLoadingState() {
        if (this.currentSongDiv) {
            this.currentSongDiv.classList.add('loading');
        }
    }

    /**
     * Remover estado de carga
     */
    removeLoadingState() {
        if (this.currentSongDiv) {
            this.currentSongDiv.classList.remove('loading');
        }
    }

    /**
     * Obtener información actual del reproductor
     */
    getPlaylistInfo() {
        return {
            total: this.playlist.length,
            current: this.currentIndex + 1,
            isPlaying: this.isPlaying,
            isShuffled: this.isShuffled,
            volume: this.volume,
            currentSong: this.playlist[this.currentIndex] || null,
            currentSongName: this.playlist[this.currentIndex] ? this.extractSongName(this.playlist[this.currentIndex]) : null
        };
    }

    /**
     * Destruir el reproductor (cleanup)
     */
    destroy() {
        if (this.audioPlayer) {
            this.audioPlayer.pause();
            this.audioPlayer.src = '';
        }

        // Remover event listeners si es necesario
        // (Los event listeners se limpian automáticamente cuando se destruye el elemento)

        console.log('Reproductor de música destruido');
    }
}

// ==========================================
// INICIALIZACIÓN Y CONTROLES GLOBALES
// ==========================================

/**
 * Inicializar el reproductor cuando se carga la página
 */
document.addEventListener('DOMContentLoaded', function () {
    console.log('🌐 DOM completamente cargado');

    // Verificar que los elementos existen antes de inicializar
    const audioElement = document.getElementById('audio-player');
    console.log('🔍 Buscando elemento audio-player:', !!audioElement);

    if (audioElement) {
        try {
            console.log('🎵 Iniciando Music Player...');
            window.musicPlayer = new MusicPlayer();
            console.log('✅ Reproductor de música inicializado correctamente');

            // Debug inicial
            setTimeout(() => {
                console.log('🔧 Estado inicial del reproductor:');
                console.log('- Playlist:', window.musicPlayer.playlist);
                console.log('- Audio src:', window.musicPlayer.audioPlayer.src);
                console.log('- Volumen:', window.musicPlayer.audioPlayer.volume);
                console.log('- Muted:', window.musicPlayer.audioPlayer.muted);
            }, 2000);

        } catch (error) {
            console.error('❌ Error inicializando reproductor:', error);
        }
    } else {
        console.log('⚠️ Elementos del reproductor no encontrados en esta página');
    }
});

/**
 * Controles globales para acceso desde consola o otros scripts
 */
window.MusicPlayerControls = {
    // Controles básicos
    play: () => window.musicPlayer?.play(),
    pause: () => window.musicPlayer?.pause(),
    next: () => window.musicPlayer?.nextSong(),
    previous: () => window.musicPlayer?.previousSong(),
    shuffle: () => window.musicPlayer?.toggleShuffle(),

    // Controles de volumen
    setVolume: (volume) => window.musicPlayer?.setVolume(volume),
    mute: () => window.musicPlayer?.toggleMute(),

    // Información
    getInfo: () => window.musicPlayer?.getPlaylistInfo(),
    getCurrentSong: () => window.musicPlayer?.playlist[window.musicPlayer?.currentIndex],

    // Control avanzado
    goToSong: (index) => {
        if (window.musicPlayer && index >= 0 && index < window.musicPlayer.playlist.length) {
            window.musicPlayer.loadSong(index);
            if (window.musicPlayer.isPlaying) {
                window.musicPlayer.play();
            }
        }
    },

    // Reload playlist
    reloadPlaylist: () => window.musicPlayer?.loadPlaylist(),

    // Debug info
    debug: () => {
        console.log('=== MUSIC PLAYER DEBUG ===');
        console.log('Estado:', window.musicPlayer?.getPlaylistInfo());
        console.log('Playlist:', window.musicPlayer?.playlist);
        console.log('Elemento audio:', window.musicPlayer?.audioPlayer);
        console.log('========================');
    }
};

// Agregar acceso rápido para debugging
window.mp = window.MusicPlayerControls;