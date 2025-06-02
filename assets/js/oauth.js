jQuery(document).ready(function() {
    oauth();
})

async function oauth() {
    const accessToken = localStorage.getItem('access_token');
    const tokenExpiration = localStorage.getItem('token_expiration');

    // Check if the token is expired
    function isTokenExpired() {
        if (!tokenExpiration) return true;
        return Date.now() > parseInt(tokenExpiration, 10);
    }

    // Check API authentication
    async function isAuthenticated() {
        if (!accessToken || isTokenExpired()) {
            return false;
        }

        try {
            const response = await fetch('https://cmexxfab.com.br/api-homol/api/usuario/profile', {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            return response.ok; // Returns true if the token is valid
        } catch (error) {
            console.error('Error verifying authentication:', error);
            return false;
        }
    }

    const loggedIn = await isAuthenticated();

    if (!loggedIn) {
        // Clear expired token and redirect to login page
        localStorage.removeItem('access_token');
        localStorage.removeItem('token_expiration');
        localStorage.removeItem('user_name');
        window.location.href = '/login';
    } else {
        // console.log('User is authenticated. Proceeding...');
        try {
            const profileResponse = await fetch('https://cmexxfab.com.br/api-homol/api/usuario/profile', {
                method: 'GET',
                headers: { Authorization: `Bearer ${accessToken}` },
            });

            if (profileResponse.ok) {
                const userProfile = await profileResponse.json();
                const name = userProfile.nome;

                const userId = userProfile.id;
                const filiais = userProfile.filiais;
                const codCli = filiais.length > 0 ? filiais[0].codcli : null;
                const coligadas = userProfile.coligadas
                const coligadaId = coligadas.length > 0 ? coligadas[0].cod : null;

                localStorage.setItem('user_name', name);
                localStorage.setItem('user_id', userId);
                localStorage.setItem('filiais', JSON.stringify(filiais));
                localStorage.setItem('codCli', codCli);
                localStorage.setItem('coligadaId', coligadaId);

                $('.loader').addClass('loader--hidden');
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('token_expiration');
                localStorage.removeItem('user_name');
                localStorage.removeItem('user_id');
                localStorage.removeItem('filiais');
                localStorage.removeItem('idFilial');
                localStorage.removeItem('codCli');
                localStorage.removeItem('nomeFilial');
                window.location.href = '/login';

                console.error('Failed to fetch user profile:', profileResponse.status);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    }
}