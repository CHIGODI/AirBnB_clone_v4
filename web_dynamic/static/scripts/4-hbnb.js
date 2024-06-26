// Function to render places based on selected amenities
function renderFilteredPlaces (amenityIds = {}) {
  $.ajax({
    type: 'POST',
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify({
      amenities: amenityIds
    }),
    success: function (places) {
      // Clear existing places before rendering new ones
      $('.places').empty();

      if (places.length === 0) {
        $('.places').append("<div class='no-places'></div>").text('No places found with the amenity combinations, try picking others');
      }

      // stores artcles temporally before rendering at once
      const articlesFragment = document.createDocumentFragment();

      // Loop through places response to retrieve each place's data
      $.each(places, function (index, place) {
        const placesArticle = $('<article></article>');

        const titleBox = $('<div class="title_box"></div>');
        titleBox.append('<h2>' + place.name + '</h2>');
        titleBox.append('<div class="price_by_night">$' + place.price_by_night + '</div>');

        const information = $('<div class="information"></div>');
        information.append('<div class="max_guest">' + place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '') + '</div>');
        information.append('<div class="number_rooms">' + place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '') + '</div>');
        information.append('<div class="number_bathrooms">' + place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '') + '</div>');

        const description = $('<div class="description"></div>').append(place.description);

        placesArticle.append(titleBox, information, description);
        articlesFragment.appendChild(placesArticle[0]);
      });
      $('.places').append(articlesFragment);
    }
  });
}

// ------------------------------------------------------------------------
// wait for DOM to Load
$(function () {
  let checkedAmenityIds = [];
  let checkedAmenityNames = [];

  // Event listener for changes in checked amenities
  $('.popover ul li input[type="checkbox"]').change(function () {
    checkedAmenityIds = [];
    checkedAmenityNames = [];
    $('.popover ul li input[type="checkbox"]').each(function () {
      if ($(this).is(':checked')) {
        const id = $(this).data('id');
        const name = $(this).data('name');
        checkedAmenityIds.push(id);
        checkedAmenityNames.push(name);
      } else {
        const id = $(this).data('id');
        const index = checkedAmenityIds.indexOf(id);
        if (index !== -1) {
          checkedAmenityIds.splice(index, 1);
          checkedAmenityNames.splice(index, 1);
        }
      }
    });
    console.log(checkedAmenityNames);
    $('.amenities h4').text(checkedAmenityNames.join(', '));
    $('.container button').click(function () {
      renderFilteredPlaces(checkedAmenityIds);
    });
  });

  // --------------------------------------------------------------------
  // AJAX call to check API status
  $.ajax({
    type: 'GET',
    url: 'http://0.0.0.0:5001/api/v1/status/',
    success: function (response) {
      if (response.status === 'OK') {
        $('header #api_status').addClass('available');
      } else {
        $('header #api_status').removeClass('available');
      }
    }
  });

  // --------------------------------------------------------------------
  // Initial rendering of places
  renderFilteredPlaces();
});
