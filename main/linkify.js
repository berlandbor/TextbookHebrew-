function linkify(text) {
    const urlRegex = /((https?:\/\/|www\.)[^\s]+)/g;

    return text
        .replace(urlRegex, (url) => {
            const hyperlink = url.startsWith('http') ? url : `https://${url}`;

            // === GOOGLE DRIVE SUPPORT ===
            const googleDriveMatch = hyperlink.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)\//);
            if (googleDriveMatch && googleDriveMatch[1]) {
                const fileId = googleDriveMatch[1];
                
                // Проверка на формат "preview"
                if (hyperlink.includes('/preview')) {
                    return `
                        <div style="position: relative; max-width: 640px; text-align: center; margin: auto;">
                            <iframe id="gdrive-${fileId}" src="https://drive.google.com/file/d/${fileId}/preview" 
                                    width="640" height="480" allow="autoplay" allowfullscreen style="display: block; margin: 0 auto;"></iframe>
                            <button onclick="openFullScreen('gdrive-${fileId}')"style="margin-top: 5px; background-color: rgba(0, 0, 0, 0.7); color: white; border: none; padding: 0px 10px 15px 10px; border-radius: 4px; cursor: pointer; font-size: 16px;">
                                Полный экран
                            </button>
                        </div>`;
                }

                // Прямая ссылка для аудио/видео/изображений
                const directLink = `https://drive.google.com/uc?export=download&id=${fileId}`;

                if (/\.(mp4|webm|ogg)$/i.test(hyperlink) || hyperlink.includes("video")) {
                    return `<video controls style="max-width:100%; height:auto;">
                                <source src="${directLink}" type="video/mp4">
                                Ваш браузер не поддерживает видео.
                            </video>`;
                }

                if (/\.(mp3|wav|ogg)$/i.test(hyperlink) || hyperlink.includes("audio")) {
                    return `<audio controls style="width:100%;">
                                <source src="${directLink}" type="audio/mpeg">
                                Ваш браузер не поддерживает аудио.
                            </audio>`;
                }

                if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(hyperlink) || hyperlink.includes("image")) {
                    return `<img src="${directLink}" alt="Image" style="max-width:100%; height:auto;">`;
                }

                return `<a href="${directLink}" target="_blank" rel="noopener noreferrer">Скачать файл с Google Диска</a>`;
            }

            // === Обычные ссылки ===
            if (/\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(hyperlink)) {
                return `<img src="${hyperlink}" alt="Image" style="max-width:100%; height:auto;">`;
            }

            const youtubeMatch = hyperlink.match(/(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=)?([^\s&]+)/);
            if (youtubeMatch && youtubeMatch[1]) {
                const videoId = youtubeMatch[1];
                return `<iframe width="300" height="200" src="https://www.youtube.com/embed/${videoId}" 
                        frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>`;
            }

            if (/\.(mp4|webm|ogg)$/i.test(hyperlink)) {
                return `<video controls style="max-width:100%; height:auto;">
                            <source src="${hyperlink}" type="video/${hyperlink.split('.').pop()}">
                            Ваш браузер не поддерживает видео.
                        </video>`;
            }

            if (/\.(mp3|wav|ogg)$/i.test(hyperlink)) {
                return `<audio controls style="width:100%;">
                            <source src="${hyperlink}" type="audio/${hyperlink.split('.').pop()}">
                            Ваш браузер не поддерживает аудио.
                        </audio>`;
            }

            return `<a href="${hyperlink}" target="_blank" rel="noopener noreferrer">${url}</a>`;
        })
        // Заголовки
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        // Горизонтальная линия
        .replace(/^---$/gm, '<hr>')
        // Цитаты
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        // Нумерованные списки
        .replace(/(^\d+\..+(?:\n\d+\..+)*)/gm, (match) => {
            const items = match.split('\n').map(item => item.replace(/^\d+\. (.+)$/, '<li>$1</li>')).join('');
            return `<ol>${items}</ol>`;
        })
        // Маркированные списки
        .replace(/(^- .+(?:\n- .+)*)/gm, (match) => {
            const items = match.split('\n').map(item => item.replace(/^- (.+)$/, '<li>$1</li>')).join('');
            return `<ul>${items}</ul>`;
        })
        // Жирный текст
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Курсив
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Кодовые блоки и строки
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        // Переносы строк
        .replace(/\n/g, '<br>');
}

// === Функция для открытия полного экрана ===
function openFullScreen(elementId) {
    const iframe = document.getElementById(elementId);
    if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
    } else if (iframe.mozRequestFullScreen) { // Firefox
        iframe.mozRequestFullScreen();
    } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari и Opera
        iframe.webkitRequestFullscreen();
    } else if (iframe.msRequestFullscreen) { // IE/Edge
        iframe.msRequestFullscreen();
    }
}
