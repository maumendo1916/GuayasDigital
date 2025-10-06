function enviarFormulario() {
    const emailValue = document.getElementById('email').value;
   

    const formData = new FormData();

    formData.append('nombre', document.getElementById('nombre').value);
    formData.append('web', document.getElementById('web').value);
    formData.append('pais', document.getElementById('pais').value);
    formData.append('telefono', document.getElementById('telefono').value);
    formData.append('email', emailValue);
    formData.append('servicio', document.getElementById('servicio').value);
    formData.append('plazo', document.getElementById('plazo').value);
    formData.append('asunto', document.getElementById('asunto').value);
    formData.append('mensaje', document.getElementById('mensaje').value);

    const fileInput = document.getElementById('file-upload').files[0];
    if (fileInput) {
        formData.append('archivo', fileInput);
    }

    fetch('/Home/EnviarFormulario', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(response => {
            if (response.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Formulario enviado!',
                    text: response.message,
                    timer: 3000,
                    timerProgressBar: true,
                    showConfirmButton: true,
                    confirmButtonColor: '#d33'
                });
                document.getElementById('contactForm').reset();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.message,
                    confirmButtonColor: '#d33'
                });
            }
        })
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al enviar el formulario',
                confirmButtonColor: '#d33'
            });
        });

    return false;
}

// Función para crear efecto de titilado por dígito
function createFlickeringCounter(elementId) {
    const element = document.getElementById(elementId);

    function wrapDigitsInSpans(text) {
        return text.split('').map(char => {
            if (char >= '0' && char <= '9') {
                return `<span class="digit">${char}</span>`;
            }
            return char;
        }).join('');
    }

    function startFlickering() {
        const digits = element.querySelectorAll('.digit');

        digits.forEach((digit, index) => {
            // Cada dígito titila en momentos aleatorios
            setInterval(() => {
                if (Math.random() < 0.15) { // 15% probabilidad de titilar
                    digit.style.opacity = '0.3';
                    digit.style.textShadow = '0 0 2px #ff4500';

                    setTimeout(() => {
                        digit.style.opacity = '1';
                        digit.style.textShadow = '0 0 5px #ff4500, 0 0 10px #ff4500, 0 0 15px #ff4500';
                    }, Math.random() * 200 + 50); // Entre 50-250ms
                }
            }, Math.random() * 3000 + 1000); // Entre 1-4 segundos
        });
    }

    // Observar cambios en el contenido
    const observer = new MutationObserver(() => {
        const currentText = element.textContent;
        element.innerHTML = wrapDigitsInSpans(currentText);
        startFlickering();
    });

    // Inicializar
    const initialText = element.textContent;
    element.innerHTML = wrapDigitsInSpans(initialText);
    startFlickering();

    observer.observe(element, { childList: true, characterData: true, subtree: true });
}

$(document).ready(function () {
    $.ajax({
        url: '/Home/ObtenerContador',
        type: 'POST',
        contentType: 'application/json; charset=utf-8',
        success: function (response) {
            if (response.success) {
                $('#cont').text(response.valor);

                // Inicializar efecto de titilado por dígito
                setTimeout(() => {
                    createFlickeringCounter('cont');
                }, 500);

            } else {
                console.error('Error del servidor: ', response.error);
            }
        },
        error: function (xhr, status, error) {
            console.error('Error AJAX: ', error);
        }
    });

    // ... resto del código del reproductor de música
});
