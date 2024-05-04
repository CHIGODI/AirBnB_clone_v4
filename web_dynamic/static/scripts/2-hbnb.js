$(function () {
  $('.popover ul li input[type="checkbox"]').change(function () {
    const checkedAmenityIds = [];
    const checkedAmenityNames = [];
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
    $('.amenities h4').text(checkedAmenityNames.join(', '));
  });
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
});
