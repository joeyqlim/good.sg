$(document).on("scroll", function () {
  let pageTop = $(document).scrollTop(); // distance from top of page
  let pageBottom = pageTop + $(window).height() // distance from bottom of page
  let tags = $('section');

  for (let i = 0; i < tags.length; i++) {
    let tag = tags[i];
    if ($(tag).position().top < pageBottom){
      $(tag).addClass("visible");
    } else {
      $(tag).removeClass("visible");
    }
  };
});
