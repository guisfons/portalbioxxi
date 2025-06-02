$(document).ready(() => {
    $('.loader').addClass('loader--hidden');
    
    $('.login__senha').on('click', function () {
        esqueciSenha($(this))
    })

    $('.login__form').on('submit', function (event) {
        event.preventDefault()
        oauth()
    })
})

function esqueciSenha(target) {
    $(target).closest('.login').hide()
    $('.esqueci-senha').show()
}

async function oauth() {
    const username = $('#usuario').val();
    const password = $('#senha').val();

    try {
        const response = await fetch(ajax_object.ajax_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                action: 'do_oauth',
                username,
                password,
            }),
        });

        const result = await response.json();

        if (!result.success) {
            const errorMessage = result.data?.message || 'Erro no login';
            throw new Error(errorMessage);
        }

        const { access_token, refresh_token, expires_in } = result.data;

        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('token_expiration', Date.now() + expires_in * 1000);

        window.location.href = '/';
    } catch (error) {
        console.error(error);
        alert(error.message || 'Erro inesperado.');
    }
}

async function refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
        console.error('No refresh token available');
        return null;
    }

    try {
        const response = await fetch('/wp-json/custom-auth/v1/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh token');
        }

        const result = await response.json();
        localStorage.setItem('access_token', result.access_token);
        localStorage.setItem('token_expiration', Date.now() + result.expires_in * 1000);

        // console.log('Token refreshed successfully');
        return result.access_token;
    } catch (error) {
        console.error('Error refreshing token:', error.message);
        return null;
    }
}

// Call this before making API requests
async function getValidAccessToken() {
    const expiration = localStorage.getItem('token_expiration');
    if (Date.now() > expiration) {
        return await refreshToken();
    }
    return localStorage.getItem('access_token');
}