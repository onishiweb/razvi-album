function initFancybox() {
	var fancybox_options = {

		// Space around image, ignored if zoomed-in or viewport width is smaller than 800px
		margin : [40, 0],

		// Should display infobar (counter and arrows at the top)
		infobar : false,

		// Should display toolbar (buttons at the top)
		toolbar : true,

		// What buttons should appear in the top right corner.
		// Buttons will be created using templates from `btnTpl` option
		// and they will be placed into toolbar (class="fancybox-toolbar"` element)
		buttons : [
			'close'
		],

        idleTime : 100,

		// Disable right-click and use simple image protection for images
		protect : true,

		// Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
		modal : false,

		// Custom CSS class for slide element
		slideClass : 'ao-fancybox-slide',

		// Custom CSS class for layout
		baseClass : 'ao-fancybox-base',

		// Try to focus on the first focusable element after opening
		autoFocus : true

	};

	$("[data-fancybox]").fancybox(fancybox_options);

    // $.fancybox.open({
    //     src  : '#welcome-content',
    //     type : 'inline'
    // });
}

function Shuffle(o) {
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
}

function updateImages(imageData, category) {
	var $images = $('.image-thumbnail');
	var promises = [];

	// Fade out the images
	$images.addClass('fade-out');

	setTimeout(function() {
        $.each($images, function(key, val) {
            var def = $.Deferred();
        	var imagePath = 'images/';

        	if (imageData[key].image !== 'placeholder.jpg') {
        		imagePath+= category + '/';
        	}

        	$($images[key]).attr('href', imagePath + imageData[key].image);
            $($images[key]).data('caption', imageData[key].caption);

        	// Remove image and create new one. Collect load events and then remove fade-out class
        	$($images[key]).empty();

        	var tmpImg = new Image();

        	tmpImg.src = imagePath + imageData[key].image;
        	tmpImg.onload = function() {
        		// Run onload code.
        		$($images[key]).append(tmpImg);
                promises.push(def.resolve());
        	};
    	})
    }, 400 );

    setTimeout(function() { $images.removeClass('fade-out') }, 600);
}

function loadImagesFromFilter(e) {
    e.preventDefault();

    $('[data-filter]').removeClass('active');
    $(this).addClass('active');

	var category = $(this).data('filter');
	var $images = $('.image-thumbnail');

	// Load images list JSON file
	$.getJSON( "imageList.json", function( data ) {
		// retreive and randomise array:
		var imageData = Shuffle(data[category]);

		updateImages(imageData, category);
	});

	$('.site-navigation__container').toggleClass('active');
}

$(document).ready(function() {
	$('html').removeClass('no-js');

	$('.site-navigation').on('click', '#menu', function() {
		$('.site-navigation__container').toggleClass('active');
	});

	initFancybox();

    // Load images list JSON file
    $.getJSON( "imageList.json", function( data ) {
        // retreive and randomise array:
        var imageData = Shuffle(data['home']);

        updateImages(imageData, 'home');
    });

	$('.site-navigation').on('click', '[data-filter]', loadImagesFromFilter);
});

