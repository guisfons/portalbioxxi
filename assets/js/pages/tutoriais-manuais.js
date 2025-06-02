jQuery(document).ready(function ($) {    
    (async function init() {
        const accessToken = localStorage.getItem('access_token')

        async function isAuthenticated() {
            if (!accessToken) return false

            try {
                const response = await fetch('https://cmexxfab.com.br/api-homol/api/usuario/profile', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${accessToken}` },
                })

                return response.ok
            } catch (error) {
                console.error('Error verifying authentication:', error)
                return false
            }
        }

        async function getVideos() {
            try {
                const response = await fetch('https://cmexxfab.com.br/api-homol/api/educacional/list', {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${accessToken}` },
                })

                if (!response.ok) {
                    throw new Error(`Failed to fetch videos: ${response.status}`)
                }

                const videoAnexosList = await response.json()
                const videosList = videoAnexosList.videos
                const videoIcon = `<svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.0234 9.03125C21.9047 8.96268 21.77 8.92658 21.6328 8.92658C21.4957 8.92658 21.361 8.96268 21.2422 9.03125L17.7656 11.375V8.9375C17.7656 8.7303 17.6833 8.53159 17.5368 8.38507C17.3903 8.23856 17.1916 8.15625 16.9844 8.15625H16.1875C16.6946 7.48009 16.9688 6.6577 16.9688 5.8125C16.9686 5.03767 16.738 4.28038 16.3064 3.63693C15.8747 2.99349 15.2614 2.49296 14.5445 2.199C13.8276 1.90503 13.0395 1.83091 12.2803 1.98607C11.5212 2.14122 10.8253 2.51863 10.2812 3.07031C10.003 2.45167 9.59377 1.90079 9.08185 1.45571C8.56993 1.01063 7.96751 0.681967 7.31619 0.492406C6.66486 0.302846 5.98016 0.256908 5.30935 0.357764C4.63854 0.458621 3.99762 0.703869 3.43083 1.07657C2.86405 1.44928 2.38491 1.94056 2.0265 2.51649C1.66809 3.09242 1.43895 3.73928 1.3549 4.4124C1.27086 5.08552 1.33391 5.76886 1.53971 6.41524C1.7455 7.06162 2.08913 7.65563 2.54688 8.15625H1.34375C1.13655 8.15625 0.937836 8.23856 0.791323 8.38507C0.64481 8.53159 0.5625 8.7303 0.5625 8.9375V19.875C0.5625 20.0822 0.64481 20.2809 0.791323 20.4274C0.937836 20.5739 1.13655 20.6563 1.34375 20.6563H16.9688C17.176 20.6563 17.3747 20.5739 17.5212 20.4274C17.6677 20.2809 17.75 20.0822 17.75 19.875V17.4297L21.2266 19.7734C21.3463 19.8524 21.4854 19.8969 21.6288 19.902C21.7721 19.9072 21.9141 19.8728 22.0391 19.8026C22.1642 19.7324 22.2675 19.6291 22.3378 19.5041C22.4081 19.379 22.4426 19.2371 22.4375 19.0938V9.71875C22.4371 9.57742 22.3984 9.43884 22.3255 9.31777C22.2526 9.1967 22.1482 9.09768 22.0234 9.03125ZM13.0625 3.46875C13.526 3.46875 13.9792 3.60621 14.3646 3.86374C14.75 4.12128 15.0505 4.48732 15.2278 4.91559C15.4052 5.34385 15.4516 5.8151 15.3612 6.26974C15.2708 6.72439 15.0476 7.142 14.7198 7.46978C14.392 7.79756 13.9744 8.02078 13.5197 8.11122C13.0651 8.20165 12.5939 8.15524 12.1656 7.97784C11.7373 7.80045 11.3713 7.50005 11.1137 7.11462C10.8562 6.72919 10.7188 6.27605 10.7188 5.8125C10.7188 5.1909 10.9657 4.59476 11.4052 4.15522C11.8448 3.71568 12.4409 3.46875 13.0625 3.46875ZM9.9375 8.15625H9.49219C9.57552 8.0625 9.65625 7.96615 9.73438 7.86719C9.82031 7.96875 9.88281 8.0625 9.9375 8.15625ZM2.90625 5.03125C2.90625 4.41318 3.08953 3.809 3.43291 3.29509C3.77629 2.78119 4.26435 2.38065 4.83536 2.14413C5.40638 1.9076 6.03472 1.84572 6.64091 1.9663C7.2471 2.08688 7.80392 2.3845 8.24096 2.82154C8.678 3.25858 8.97563 3.8154 9.0962 4.42159C9.21678 5.02778 9.1549 5.65612 8.91837 6.22714C8.68185 6.79816 8.28131 7.28621 7.76741 7.62959C7.2535 7.97297 6.64932 8.15625 6.03125 8.15625C5.20245 8.15625 4.40759 7.82701 3.82154 7.24096C3.23549 6.65491 2.90625 5.86005 2.90625 5.03125ZM16.1875 19.0938H2.125V9.71875H16.1875V19.0938ZM20.875 17.6328L17.75 15.5469V13.2656L20.875 11.1797V17.6328Z" fill="#41B17E"/></svg>`
                
                // console.log('Videos:', videosList)

                const categories = videosList.reduce((acc, cur) => {
                    if (!acc.find(cat => cat.id === cur.id_categoria)) {
                        acc.push({ id: cur.id_categoria, name: cur.nome_categoria })
                    }
                    return acc
                }, [])

                const select = $('#categoria')
                categories.forEach(category => {
                    select.append(`<option value="${category.id}">${category.name}</option>`)
                })
                
                const videoContainer = $('.tutoriais-manuais')
                videosList.forEach(video => {
                    let videoTitle = video.titulo
                    let videoCat = video.nome_categoria
                    let videoCatId = video.id_categoria
                    let videoDate = formatDate(video.dt_inclusao)
                    let videoEmbed = video.embbed
                    let videoUrl = video.url
                    const videoElement = `
                        <div class="tutoriais-manuais__video" data-category="${videoCatId}" data-name="${videoTitle}" data-date="${videoDate}">
                            <div class="tutoriais-manuais__video-heading">
                                <span>Inserido em ${videoDate}</span>
                                <figure><a href="${videoUrl}" title="${videoTitle}" target="_blank">${videoIcon}</a></figure>
                            </div>
                            <figure><iframe src="${videoEmbed}" title="${videoTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></figure>
                            <span>${videoCat}</span>
                            <h3>${videoTitle}</h3>
                        </div>
                    `;
                    videoContainer.append(videoElement)
                })
            } catch (error) {
                console.error('Error fetching videos:', error)
            }
        }

        // Check authentication and load videos
        const loggedIn = await isAuthenticated()

        if (!loggedIn) {
            alert('Você não esta autenticado. Redirecionando para a página de login...')
            window.location.href = '/login'
        } else {
            // console.log('Usuário autenticado. Carregando vídeos...')
            await getVideos()
        }
    })()

    filter()
})

function formatDate(dateString) {
    const date = new Date(dateString)

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
}

function filter() {
    const videoFilter = document.querySelector('input[name="pesquisa"]')
    $(videoFilter).on('input', function() {
        const query = $(this).val().toLowerCase()
        const videos = $('.tutoriais-manuais__video')

        videos.each(function() {
            const containerText = $(this).text().toLowerCase()

            if (containerText.includes(query)) {
                $(this).show()
            } else {
                $(this).hide()
            }
        })
    })

    const videoCategory = $('select[name="categoria"]')
    videoCategory.on('change', function() {
        const selectedCategory = $(this).val()
        const videos = $('.tutoriais-manuais__video')

        if(selectedCategory == '') {
            videos.show()
            return
        }

        videos.each(function() {
            const videoCategory = $(this).data('category')

            if (videoCategory == selectedCategory) {
                $(this).show()
            } else {
                $(this).hide()
            }
        })
    })

    const sortOrderSelect = $('select[name="ordem"]');
    sortOrderSelect.on('change', function () {
        const ordem = $(this).val();
        const $videos = $('.tutoriais-manuais__video');

        const sortedVideos = $videos.sort(function (a, b) {
            const dateA = new Date($(a).data('date'));
            const dateB = new Date($(b).data('date'));

            if (ordem === 'asc') {
                return dateA - dateB;
            } else if (ordem === 'desc') {
                return dateB - dateA;
            }
            return 0;
        });

        $('.tutoriais-manuais').html(sortedVideos);
    });
}