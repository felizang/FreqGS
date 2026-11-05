window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "./static/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 1,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    /*var player = document.getElementById('interpolation-video');
    player.addEventListener('loadedmetadata', function() {
      $('#interpolation-slider').on('input', function(event) {
        console.log(this.value, player.duration);
        player.currentTime = player.duration / 100 * this.value;
      })
    }, false);*/
    preloadInterpolationImages();

    $('#interpolation-slider').on('input', function(event) {
      setInterpolationImage(this.value);
    });
    setInterpolationImage(0);
    $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    // BeforeAfter init
    ['#example1', '#example2', '#example3', '#example4',
        '#example5', '#example6', '#example7', '#example8',
        '#example9', '#example10', '#example11', '#example12',
        '#example13', '#example14', '#example15', '#example16',
        '#example17', '#example18',
    ].forEach(id => {
      if (document.querySelector(id)) {
        new BeforeAfter({ id });
      }
    });

    // Video BeforeAfter init
    document.querySelectorAll('.video-compare-container').forEach((el) => {
      new BeforeAfterVideo({ id: `#${el.id}` });
    });

    bulmaSlider.attach();

})


function copyBibTeX() {
  const bibtexText = document.querySelector('.bibtex code').innerText;

  const copyIcon = document.getElementById('copyIcon');
  const checkIcon = document.getElementById('checkIcon');
  const copyText = document.getElementById('copyText');
  const copiedText = document.getElementById('copiedText');

  navigator.clipboard.writeText(bibtexText).then(() => {
    // Show copied state
    copyIcon.style.display = 'none';
    copyText.style.display = 'none';
    checkIcon.style.display = 'inline';
    copiedText.style.display = 'inline';

    // Revert after 1.5 seconds
    setTimeout(() => {
      checkIcon.style.display = 'none';
      copiedText.style.display = 'none';
      copyIcon.style.display = 'inline';
      copyText.style.display = 'inline';
    }, 1500);
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}













class BeforeAfter {
    constructor(enteryObject) {

        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeInset = beforeAfterContainer.querySelector('.bal-before-inset');
        const beforeText = beforeAfterContainer.querySelector('.bal-beforePosition');
        const afterText = beforeAfterContainer.querySelector('.bal-afterPosition');
        const handle = beforeAfterContainer.querySelector('.bal-handle');

        function updateSlider(percent) {
            percent = Math.max(0, Math.min(percent, 100));

            before.style.width = percent + "%";
            handle.style.left = percent + "%";

            // Hide labels near edges
            if (percent > 90) {
                afterText.style.opacity = "0";
            } else {
                afterText.style.opacity = "1";
            }

            if (percent < 10) {
                beforeText.style.opacity = "0";
            } else {
                beforeText.style.opacity = "1";
            }
        }

        function updateInsetWidth() {
            beforeInset.style.width = beforeAfterContainer.offsetWidth + "px";
        }

        updateInsetWidth();
        window.addEventListener("resize", updateInsetWidth);

        updateSlider(50);

        beforeAfterContainer.addEventListener("mousemove", (e) => {
            const rect = beforeAfterContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
        });

        beforeAfterContainer.addEventListener("touchmove", (e) => {
            const rect = beforeAfterContainer.getBoundingClientRect();
            const x = e.changedTouches[0].clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
        });
    }
}



class BeforeAfterVideo {
    constructor(enteryObject) {

        const beforeAfterContainer = document.querySelector(enteryObject.id);
        const before = beforeAfterContainer.querySelector('.bal-before');
        const beforeInset = beforeAfterContainer.querySelector('.bal-before-inset');
        const beforeText = beforeAfterContainer.querySelector('.videoBeforeLabel');
        const afterText = beforeAfterContainer.querySelector('.videoAfterLabel');
        const handle = beforeAfterContainer.querySelector('.bal-handle');

        function updateSlider(percent) {
            percent = Math.max(0, Math.min(percent, 100));

            before.style.width = percent + "%";
            handle.style.left = percent + "%";

            /*
              Video labels:
              Baseline label is at the top-left corner, Ours at the top-right.
              Hide each when the slider gets close to its edge.
            */
            if (beforeText) {
                beforeText.style.display = percent < 10 ? "none" : "block";
            }

            if (afterText) {
                afterText.style.display = percent > 90 ? "none" : "block";
            }
        }

        function updateInsetWidth() {
            beforeInset.style.width = beforeAfterContainer.offsetWidth + "px";
        }

        updateInsetWidth();
        window.addEventListener("resize", updateInsetWidth);

        updateSlider(50);

        beforeAfterContainer.addEventListener("mousemove", (e) => {
            const rect = beforeAfterContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
        });

        beforeAfterContainer.addEventListener("touchmove", (e) => {
            const rect = beforeAfterContainer.getBoundingClientRect();
            const x = e.changedTouches[0].clientX - rect.left;
            const percent = (x / rect.width) * 100;
            updateSlider(percent);
        });
    }
}



function syncCompareVideos(containerId) {
  const container = document.querySelector(containerId);
  if (!container) return;

  const videos = container.querySelectorAll("video");
  if (videos.length < 2) return;

  const beforeVideo = videos[0];
  const afterVideo = videos[1];

  function syncPlay() {
    videos.forEach(v => {
      v.play().catch(() => {});
    });
  }

  function syncPause() {
    videos.forEach(v => v.pause());
  }

  function syncTime(source) {
    videos.forEach(v => {
      if (v !== source && Math.abs(v.currentTime - source.currentTime) > 0.15) {
        v.currentTime = source.currentTime;
      }
    });
  }

  videos.forEach(video => {
    video.addEventListener("play", syncPlay);
    video.addEventListener("pause", syncPause);
    video.addEventListener("seeked", () => syncTime(video));
    video.addEventListener("timeupdate", () => syncTime(video));
  });
}










// Video BeforeAfter init
document.querySelectorAll('.video-compare-container').forEach((el) => {
  new BeforeAfterVideo({ id: `#${el.id}` });
});


// Slow down only videoCompare2
const videoCompare2 = document.querySelector('#videoCompare2');

if (videoCompare2) {
  videoCompare2.querySelectorAll('video').forEach((video) => {
    video.playbackRate = 0.5;
  });
}


// Play / Pause button
function toggleCompareVideo(containerId) {
  const container = document.getElementById(containerId);
  const videos = container.querySelectorAll('video');

  videos.forEach((video) => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}



