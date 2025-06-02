$(document).ready(async function($) {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
        alert('Acesso negado! Token de acesso não encontrado!');
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('user_name');
        window.location.href = '/login';
        return;
    }
    
    async function userInfo() {
        try {
            const profileResponse = await fetch('https://cmexxfab.com.br/api-homol/api/usuario/profile', {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            });
    
            if (profileResponse.ok) {
                const userProfile = await profileResponse.json();
                const name = userProfile.nome;

                localStorage.setItem('user_name', name);
                // console.log(`Logged in as: ${name}`);
                
                $('.greetings__name').text(name+',');
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_expiration');
                localStorage.removeItem('user_name');
                
                console.error('Failed to fetch user profile:', profileResponse.status);
            }
        } catch (error) {
            // console.log('Usuário não disponível.', error);
            $('.greetings__name').text('[NOME DO CLIENTE],');
        }
    }

    await userInfo();

    async function fetchAndDisplayPosts() {
        const apiUrl = "https://bioxxi.com.br/wp-json/wp/v2/posts?per_page=3&_embed"; // Substitua pelo site correto
        const container = document.querySelector(".blog__container"); // Elemento onde os posts serão inseridos
    
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error("Erro ao buscar os posts");
    
            const posts = await response.json();
            container.innerHTML = ""; // Limpa o container antes de adicionar novos posts
    
            posts.forEach(post => {
                const postDate = new Date(post.date).toLocaleDateString("pt-BR"); // Formata a data
                const postTitle = post.title.rendered;
                const postLink = post.link;
                const postImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || "https://placehold.co/600x400"; // Usa imagem do post ou um placeholder
    
                const postHtml = `
                    <div class="blog__item">
                        <figure class="blog__imagem"><img width="352" height="352" src="${postImage}" class="attachment-full size-full wp-post-image" alt="${postTitle}"></figure>
                        <div class="blog__conteudo">
                            <h3>${postTitle}</h3>
                            <a href="${postLink}">Leia mais <img src="https://bioxxi.com.br/wp-content/themes/bioxxi/assets/img/icons/arrow-right.svg" alt="Seta"></a>
                        </div>
                    </div>
                `;
    
                container.innerHTML += postHtml;
            });
        } catch (error) {
            console.error("Erro:", error);
            container.innerHTML = "<p>Não foi possível carregar os posts.</p>";
        }
    }

    fetchAndDisplayPosts();
})
