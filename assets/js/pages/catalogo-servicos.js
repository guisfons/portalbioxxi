document.addEventListener('DOMContentLoaded', function () {
    const loader = document.querySelector('.loader')
    const etapasItems = document.querySelectorAll('.como-funciona__etapas-item')

    // Função que inicia a animação das etapas
    function startEtapasAnimation() {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    etapasItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('como-funciona__etapas-item--active')
                        }, index * 200)
                    })
                    observer.disconnect() // só anima uma vez
                }
            })
        }, {
            threshold: 0.3
        })

        if (etapasItems.length > 0) {
            observer.observe(etapasItems[0].parentElement)
        }
    }

    // Espera o loader ser escondido
    if (loader) {
        const observerLoader = new MutationObserver((mutations, obs) => {
            mutations.forEach(mutation => {
                if (loader.classList.contains('loader--hidden')) {
                    startEtapasAnimation()
                    obs.disconnect() // para de observar o loader
                }
            })
        })

        observerLoader.observe(loader, { attributes: true, attributeFilter: ['class'] })
    } else {
        // Se não tiver loader, já começa a animação
        startEtapasAnimation()
    }
})