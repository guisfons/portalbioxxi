<?php
    /**
     * Template Name: Brand Page
     * Template Post Type: page
     *
     * @package UAU
     * @since 1.0.0
     */

    get_header();

    while ( have_posts() ) : the_post();
        $post->post_content = apply_filters( 'the_content', $post->post_content );
    endwhile;

    wp_reset_postdata();
?>
		<main class="landing landing--brand-page">
			<section class="section">
				<section class="container">
					<section class="highlights">
						<section class="highlights__slide-main shadow-slide">
							<div class="slide">
							<?php

								try {

									echo '<img src="'. get_the_post_thumbnail_url() .'" alt="Ofertas '. $post->post_title .'">';

									for ($i = 0; $i<=4; $i++){

										$field_link = 'link_'.$i;
										$field_slide = 'image_'.$i;

										$link_slide = get_field($field_link);
										$image_slide = get_field($field_slide);

										if (empty($link_slide) || empty($image_slide)) {
											continue;
										}

										if (is_array($image_slide)) {
											$image_slide = [
												'img' => $image_slide['sizes']['medium_large'],
												'title' => $image_slide['title']
											];
										}

										echo '<a href="'. $link_slide['url'] .'" title="'. $link_slide['title'] .'">';
											echo '<img src="'. $image_slide['img'] .'" alt="'. $image_slide['title'] .'">';
										echo '</a>';

									}

								} catch(\Exception $e) {}

							?>
							</div>

						</section>

						<script>

							let startBrandSlide = function () {
								$('.highlights__slide-main .slide').slick({
									dots: false,
									arrows: true,
									autoplay:true,
									autoplaySpeed: 5000
								});
							}

							app.setInstances([
								'startBrandSlide();'
							]);

						</script>
					</section>
				</section>
			</section>

			<?php
				include(TEMPLATEPATH . '/template-parts/components/brand-offers.php');
				include(TEMPLATEPATH . '/template-parts/components/daily-offers.php');
			?>

		</main>
<?php

    get_footer();