(function($) {
  "use strict";

  // get the list of existing subjects
  $.get('api/test-subjects', function(subjects){
    subjects.forEach(function(subject){
      $('#selectSubject').append('<option value="' + subject['_id'] + '">' + subject.name + '</option>');
    })
  })

  $('#selectSubject').change(function(){
    if($('#selectSubject').val() !== "default"){
      $.get('api/test-subjects/' + $('#selectSubject').val(), function(subject){
        $('#config').html('<h4>Configuration</h4>');
        subject.configuration.forEach(function(config){
          $('#config').append('' +
          '<div class="form-group">' +
            '<label for="inputConfig">' + config + '</label>' +
            '<input type="text" class="form-control" id="inputConfig" name="' + config + '" required>' +
          '</div>');
        })
        $('#config').append('<input type="submit" class="btn btn-info">')
      });
    } else {
      $('#config').html('');
    }
  })

  $('form').submit(function(e){
    e.preventDefault();

    if(isConnected() && hasWritePermission()){
      var test = {
        type: $('#selectSubject option:selected').html(),
        date: $('#date').val(),
        author: getUserName(),
      }
      console.log(test)
    } else if(isConnected()) {
      alert('Sorry, you don\'t have the authorization to write new test subjects. Please contact an admin to modify your privileges.\n\nAdmins:\n' + getMasterList());
    } else {
      alert('Please log in to submit new tests !')
    }

  })


  // -------------------------- Functions -------------------------- //

  function isConnected() {
    var res = false;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = !user.error;
      }
    })
    return res;
  }

  function hasWritePermission() {
    var res = false;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = user['write_permission'];
      }
    })
    return res;
  }

  function isMaster() {
    var res = false;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = user.master;
      }
    })
    return res;
  }

  function getUserName() {
    var res;
    $.ajax({
      type: 'GET',
      url: 'api/user/profile',
      async: false,
      success: function(user) {
        res = user.name;
      }
    })
    return res;
  }

  function getMasterList() {
    var res = "";
    $.ajax({
      type: 'GET',
      url: 'api/user/master',
      async: false,
      success: function(masters) {
        masters.forEach(function(master){
          res += master.firstname + ' ' + master.lastname + '\n';
        })
      }
    })
    return res;
  }

})(jQuery);
