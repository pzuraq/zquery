// // create and set menu
// var menu = Ti.UI.createMenu(),
// fileItem = Ti.UI.createMenuItem('File'),
// exitItem = fileItem.addItem('Exit', function() {
//   if (confirm('Are you sure you want to quit?')) {
//     Ti.App.exit();
//   }
// });

// menu.appendItem(fileItem);
// Ti.UI.setMenu(menu);

Array.prototype.clear = function() {
  while(this.length > 0) {
    this.pop();
  }
}

var searchResults = [];

function disableZip() {
  if($('#state').val() == '' && $('#city').val() == '') {
    $('#zip').attr('disabled', false);
  } else {
    $('#zip').attr('disabled', true);
  }
}

function disableCityState() {
  if($('#zip').val() == '') {
    $('#city').attr('disabled', false);
    $('#state').attr('disabled', false);
  } else {
    $('#city').attr('disabled', true);
    $('#state').attr('disabled', true);
  }
}

function updateTable() {
  if(!searchResults.length == 0) {
    var table = $('<table/>').addClass('table'),
        thead = $('<thead/>'),
        tbody = $('<tbody/>');

    thead.append('<tr><th>List Price</th><th>Zestimate</th><th>Ratio</th><th>Address</th></tr>');

    $.each(searchResults, function(index, item) {
      tbody.append('<tr><td>'+item.listPrice+'</td><td>'+item.zestimate+'</td><td>'+item.ratio+'</td><td>'+item.address+'</td></tr>');
    });

    table.append(thead).append(tbody);

    $('#results-container').empty().append(table);
  }
  
}

$('#city').keyup(disableZip);

$('#state').change(disableZip);

$('#zip').keyup(disableCityState);




$('#search').submit(function(event) {
  event.preventDefault();

  var url = 'http://www.zillow.com/homes/for_rent/'

  var searchData = $('#search').serializeObject();

  if(searchData.zip == '' && searchData.state == '' && searchData.city == '') {
    alert('You must enter a State, City/State, or Zip');
    return;
  }

  if(searchData.city || searchData.state) {
    if(searchData.city != '' && searchData.state != '') {
      url += searchData.city + '-' + searchData.state + '/';
    } else if (searchData.city != '' && searchData.state == '') {
      alert('You need to enter a state.');
    } else if (searchData.city == '' && searchData.state != '') {
      url += searchData.state + '/';
    }
  }

  if(searchData.zip != '') {
    if(searchData.zip.length != 5) {
      alert('Zipcode must be 5 characters.');
      return;
    }

    url += searchData.zip + '/';
  }

  // Handle hometypes
  if(searchData.hometype == null) {
    alert('You need to select at least one Home Type');
    return;
  } else if($.isArray(searchData.hometype)) {
    url += searchData.hometype.join(',') + '/'
  } else {
    url += searchData.hometype + '/'
  }

  searchResults.clear();

  console.log(url);

  $.get(url).done(function(data) {    
    var items = data.match(/<article.*?property-listing-large.*?>.*?<\/article>/g);

    if(items) {
      $.each(items, function(index, item) {
        if(item.search('price-large') != -1) {
          var listPrice = item.match(/<dt class="price-large">[\s\S]*<\/dt>/)[0].match(/\$[0-9.,K]+(\/mo)?/)[0];
        } else {
          var listPrice = "N/A";
        }

        if(item.search('zestimate') != -1) {
          var zestimate = item.match(/<div class="zestimate">[\s\S]*<\/div>/)[0].match(/\$[0-9.,K]+(\/mo)?/)[0];
        } else {
          var zestimate = "N/A";
        }

        if(item.search('property-address') != -1) {
          var address = item.match(/<dt class="property-address".*?>.+?<\/dt>/)[0].replace('<span itemprop="postalCode" class="hide">', ' ').replace(/<.*?>/g, '');
        } else if (item.search('building-name-address') != -1) {
          var address = item.match(/<dt class="building-name-address".*?>.+?<\/dt>/)[0].replace('<span itemprop="postalCode" class="hide">', ' ').replace(/<.*?>/g, '');
        } else {
          var address = "N/A";
        }

        searchResults.push({
          listPrice: listPrice,
          zestimate: zestimate,
          ratio: zestimate/listPrice,
          address: address
        });
      });

      updateTable();
    } else {
      alert("No results");
    }
  });

 
});