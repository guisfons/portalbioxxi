<?php
    /**
     * Template Name: Formas de Pagamento
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();

    $whatsapp = !empty(get_field('whatsapp', 'option')) ? get_field('whatsapp', 'option') : '#';
?>
    <section class="wrapper content heading">
        <h1><?php echo get_the_title(); ?></h1>
    </section>
    <section class="wrapper formas-pagamento" data-idlan>
        <div class="formas-pagamento__info">
            <span>Serviço contratado</span>
            <span data-servico>Bioxxi Med</span>
        </div>

        <div class="formas-pagamento__info">
            <span>Valor da fatura: R$ <span data-valor>297,00</span></span>
            <span>Sua próxima data de cobrança é <span data-vencimento>10 de dezembro de 2024</span>.</span>
        </div>

        <div class="formas-pagamento__info">
            <span>Início de contrato: <span data-inicio>00/00/0000</span></span>
            <span>Fim de contrato: <span data-fim>00/00/0000</span></span>
        </div>
    </section>
    <section class="wrapper forma-pagamento">
        <h3>Forma de pagamento</h3>
        
        <div class="forma-pagamento__row forma-pagamento__row--sem-cartao">
            <!-- <span>CARTÃO DE CRÉDITO: <span>Sem cartão de crédito adicionado</span></span> -->

            <div class="forma-pagamento__actions">
                <button type="button" class="btn btn--blue" data-action="adicionar-cartao">Adicionar cartão de crédito</button>
                <button type="button" class="btn btn--light-blue" data-action="excluir-cartao">Excluir forma de pagamento</button>
                <!-- <button type="button" class="btn btn--blue" data-action="atualizar-forma-pagamento">Atualizar forma de pagamento</button> -->
            </div>
        </div>
    </section>
    <section class="modals">
        <div class="modal" data-model="forma-pagamento">
            <div class="modal__heading">
                <h3>Nova forma de pagamento</h3>
                <button type="button" class="modal__close"><img src="<?php echo esc_url(get_template_directory_uri() . '/assets/img/icons/close.svg'); ?>"></button>
            </div>
            <div class="modal__step modal__step--active" data-step="1">
                <h3>SELECIONE A FORMA DE PAGAMENTO</h3>
                <div class="modal__formas-pagamento">
                    <label>
                        <input type="radio" name="forma-pagamento" value="cartao-credito" required>
                        <span>Cartão de crédito</span>
                    </label>
                    <label>
                        <input type="radio" name="forma-pagamento" value="boleto-bancario" required>
                        <span>Boleto bancário</span>
                    </label>
                </div>
                <article>
                    <ul>
                        <li>O boleto será exibido logo após a sua confirmação de compra.</li>
                        <li>O pedido é aprovado em até 2 dias úteis após a realização do pagamento. O prazo para entrega do pedido, é contado à partir da confirmação de pagamento.</li>
                        <li>O pagamento do boleto pode ser efetuado pela internet, utilizando o código de barras, ou diretamente em bancos, lotéricas e correios, apresentando o boleto impresso.</li>
                        <li>ATENÇÃO: Caso você tenha um programa anti pop-up, deverá desativá-lo.</li>
                    </ul>
                </article>

                <div class="modal__action">
                    <button type="button" class="btn btn--gray" data-action="cancelar">Cancelar</button>
                    <button type="button" class="btn btn--green" data-action="continuar">Continuar</button>
                </div>
            </div>
            <div class="modal__step" data-step="2" data-pagamento="cartao">
                <h4>INFORME OS DADOS DE PAGAMENTO</h4>

                <div class="modal__container">
                    <div class="modal__dados">
                        <label>
                            <span>Número do cartão</span>
                            <input type="tel" name="cartao" placeholder="0000 0000 0000 0000" id="cartao">
                        </label>
                        <label>
                            <span>Data de validade</span>
                            <input type="tel" name="validade_cartao" placeholder="MM/AA" id="validade">
                        </label>
                        <label>
                            <span>CVV</span>
                            <input type="tel" name="cvv" placeholder="000" id="cvv">
                        </label>
                        <label>
                            <span>Nome do titular</span>
                            <input type="text" name="nome" placeholder="Insira o nome do titular" id="nome">
                        </label>
                        <label>
                            <span>CPF</span>
                            <input type="tel" name="cpf" placeholder="000.000.000-00" id="cpf">
                        </label>
                    </div>
                    <div class="modal__visual">
                        <div class="modal__cartao">
                            <div class="modal__cartao-frente modal__cartao-frente--active">
                                <figure class="modal__cartao-bandeira"></figure>
                                <figure class="modal__cartao-chip"><svg width="51" height="36" viewBox="0 0 51 36" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="50" height="36" rx="5" fill="url(#paint0_linear_327_46005)"/><path d="M3.89401 0C1.74556 0 0 1.70945 0 3.81347V12.2303V23.7687V32.1865C0 34.2905 1.74556 36 3.89401 36H46.3068C48.4553 36 50.2019 34.2905 50.2019 32.1865V23.7687V12.2303V3.81347C50.2019 1.70945 48.4553 0 46.3068 0H30.992H19.2099H3.89401ZM3.89401 1.00335H18.6976V8.50788C17.2088 9.13136 16.0109 10.2833 15.3689 11.7286H1.02453V3.81347C1.02453 2.24795 2.29542 1.00335 3.89401 1.00335ZM19.7222 1.00335H30.4797V8.80086C30.4798 8.90432 30.5125 9.00524 30.5734 9.08979C30.6343 9.17433 30.7204 9.23837 30.8199 9.27314C32.3059 9.79057 33.4792 10.936 34.0105 12.39C34.0115 12.393 34.0125 12.396 34.0136 12.399C34.0625 12.5335 34.1058 12.6706 34.1437 12.8096C34.1442 12.8096 34.1452 12.8146 34.1457 12.8166C34.1814 12.9484 34.2106 13.0826 34.2357 13.2183C34.2378 13.2293 34.2409 13.2404 34.2428 13.2514C34.2631 13.3653 34.2772 13.4809 34.2898 13.5973C34.2934 13.6319 34.2998 13.6654 34.3028 13.7002C34.3153 13.8443 34.3218 13.9906 34.3218 14.1382V21.8612C34.3218 22.0088 34.3153 22.155 34.3028 22.2992C34.2997 22.3338 34.2934 22.3675 34.2898 22.4021C34.2772 22.5185 34.2631 22.6341 34.2428 22.7479C34.2407 22.759 34.2376 22.77 34.2357 22.781C34.2106 22.9167 34.1814 23.051 34.1457 23.1828C34.1452 23.1828 34.1442 23.1878 34.1437 23.1898C34.1058 23.3288 34.0625 23.4659 34.0136 23.6004C34.0129 23.6031 34.0122 23.6057 34.0115 23.6084C33.4804 25.063 32.3063 26.2086 30.8199 26.7262C30.7204 26.761 30.6343 26.825 30.5734 26.9096C30.5125 26.9941 30.4798 27.095 30.4797 27.1985V34.996H19.7222V27.1985C19.7221 27.095 19.6894 26.9941 19.6285 26.9096C19.5676 26.825 19.4815 26.761 19.382 26.7262C17.896 26.2088 16.7227 25.0634 16.1914 23.6094C16.191 23.6094 16.1908 23.6094 16.1903 23.6044C16.1897 23.6023 16.189 23.6003 16.1883 23.5983C16.1394 23.4639 16.0961 23.3268 16.0582 23.1878C16.0577 23.1878 16.0567 23.1827 16.0562 23.1807C16.0205 23.0489 15.9913 22.9146 15.9661 22.779C15.9641 22.768 15.961 22.7569 15.9591 22.7459C15.9388 22.632 15.9246 22.5165 15.9121 22.4C15.9085 22.3654 15.902 22.3319 15.8991 22.2971C15.8866 22.153 15.8801 22.0068 15.8801 21.8592V14.1361C15.8801 13.9885 15.8866 13.8423 15.8991 13.6981C15.9021 13.6635 15.9084 13.6298 15.9121 13.5953C15.9246 13.4788 15.9388 13.3633 15.9591 13.2494C15.9612 13.2383 15.9642 13.2273 15.9661 13.2162C15.9913 13.0806 16.0205 12.9463 16.0562 12.8146C16.0567 12.8146 16.0577 12.8095 16.0582 12.8075C16.0961 12.6685 16.1394 12.5314 16.1883 12.397C16.189 12.3943 16.1897 12.3916 16.1903 12.3889C16.7214 10.9344 17.8956 9.78871 19.382 9.27113C19.4815 9.23637 19.5676 9.17233 19.6285 9.08778C19.6894 9.00324 19.7221 8.90232 19.7222 8.79885V1.00134V1.00335ZM31.5042 1.00335H46.3068C47.9054 1.00335 49.1773 2.24795 49.1773 3.81347V11.7286H34.8329C34.1909 10.2833 32.993 9.13136 31.5042 8.50788V1.00335ZM1.02453 12.7319H15.0237C14.9145 13.1824 14.8556 13.6526 14.8556 14.138V21.861C14.8556 22.3464 14.9145 22.8166 15.0237 23.2671H1.02453V12.7319ZM35.1781 12.7319H49.1773V23.2671H35.1781C35.2874 22.8166 35.3462 22.3464 35.3462 21.861V14.138C35.3462 13.6526 35.2874 13.1824 35.1781 12.7319ZM1.02453 24.2704H15.3689C16.0109 25.7157 17.2088 26.8676 18.6976 27.4911V34.9967H3.89401C2.29542 34.9967 1.02453 33.752 1.02453 32.1865V24.2704ZM34.8329 24.2704H49.1773V32.1865C49.1773 33.752 47.9054 34.9967 46.3068 34.9967H31.5042V27.4911C32.993 26.8676 34.1909 25.7157 34.8329 24.2704Z" fill="#135135"/><defs><linearGradient id="paint0_linear_327_46005" x1="25" y1="0" x2="25" y2="36" gradientUnits="userSpaceOnUse"><stop stop-color="#C0A046"/><stop offset="1" stop-color="#E8DD3B"/></linearGradient></defs></svg></figure>
                                <span class="modal__cartao-numero-cartao">0000 0000 0000 0000</span>
                                <span class="modal__cartao-nome-titular">Nome titular</span>
                                <span>VALIDADE <span class="modal__cartao-validade-cartao">00/00</span></span>
                            </div>
                            <div class="modal__cartao-verso">
                                <span class="modal__cartao-cvv">000</span>
                            </div>
                        </div>

                        <div class="forma-preferida">
                            <h5>Forma de pagamento preferida</h5>
                            <label>
                                <input type="radio" name="forma-pagamento" value="credito" checked>
                                <span>Crédito</span>
                            </label>
                            <label>
                                <input type="radio" name="forma-pagamento" value="debito">
                                <span>Débito</span>
                            </label>
                        </div>
                    </div>

                </div>

                <div class="modal__action">
                    <button type="button" class="btn btn--gray" data-action="cancelar">Cancelar</button>
                    <button type="button" class="btn btn--green" data-action="salvar-cartao">Próximo</button>
                </div>
            </div>
            <div class="modal__step" data-step="3" data-pagamento="cartao">
                <h4>INFORME SEUS DADOS PESSOAIS</h4>

                <div class="modal__container">
                    <label>
                        <span>E-mail</span>
                        <input type="email" name="email" id="email">
                    </label>
                    <label>
                        <span>Telefone</span>
                        <input type="tel" name="phone" id="phone">
                    </label>
                    <label>
                        <span>Primeiro Nome</span>
                        <input type="text" name="firstName" id="firstName">
                    </label>
                    <label>
                        <span>Último Nome</span>
                        <input type="text" name="lastName" id="lastName">
                    </label>
                    <label>
                        <span>CEP</span>
                        <input type="tel" name="zip" id="zip">
                    </label>
                    <label>
                        <span>Endereço</span>
                        <input type="text" name="address1" id="address1">
                    </label>
                    <label>
                        <span>Bairro</span>
                        <input type="text" name="address2" id="address2">
                    </label>
                    <label>
                        <span>Estado</span>
                        <input type="text" name="state" id="state">
                    </label>
                </div>

                <div class="modal__action">
                    <button type="button" class="btn btn--green" data-action="enviar">Salvar cartão</button>
                </div>
            </div>
            <div class="modal__step" data-step="2" data-pagamento="boleto">
                <article>
                    <p>Informações importantes sobre o pagamento do Boleto:</p>
                    <p>- Se o Boleto não for pago até a data de vencimento, seu pedido será cancelado. O Boleto estará disponível em Boletos e Faturas até esta data.</p>
                    <p>- Evite pagar o boleto no dia do vencimento caso haja algum feriado local em sua cidade, assim como após o expediente bancário em dias úteis. Atente-se às regras de onde você fará o pagamento para evitar que seu pedido seja cancelado.</p>
                    <p>- Recomendamos que os pagamentos de boletos sejam realizados pelos canais digitais do seu banco (aplicativo ou Internet Banking). Caso não tenha acesso a estes canais, veja quais outras formas de pagamento são aceitas para que você não precise sair de casa.</p>
                </article>
                <div class="modal__action">
                    <button type="button" class="btn btn--gray" data-action="cancelar">Cancelar</button>
                    <button type="button" class="btn btn--green" data-action="gerar-boleto">Salvar</button>
                </div>
            </div>
        </div>
    </section>
    <hr/>
    <!-- <section class="wrapper servico-contratado">
        <h3>Serviço contratado</h3>
        <span>Em caso de cancelamento, por favor, entre em contato através do nosso canal de atendimento</span>

        <a href="<?= $whatsapp; ?>" target="_blank" rel="noopener noreferrer" class="btn btn--blue">Canal de atendimento</a>
    </section> -->
<?php
    get_footer();