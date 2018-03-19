 const electron = require('electron');
 var remote = electron.remote;
 var dialog = remote.dialog;
 var i = 0;

 $('#Bvalid').click(() => {
  var file = new Array();
  $('label[op=1]').each(function(){

    file.push($(this).parent().parent().parent().parent().attr('fname'));
  })
  electron.ipcRenderer.send('Bvalid', file);
  UIkit.modal.alert("Profile backuped");
});

 /*ici object avec list des file a changer et le main profile*/
 $('#Avalid').click(() => {
  if($('#mainprofile').length !=0){
   var file = new Array();
   var main = $('#mainprofile').attr("fname");
   $('label[op=1]').each(function(){

    file.push($(this).parent().parent().parent().parent().attr('fname'));
  })
   electron.ipcRenderer.send('Avalid', {"main": main, profiles: file});
   UIkit.modal.alert("Profile apply (we backup ur old profiles : see .backupauto)");
 } else {
   UIkit.modal.alert("You must select a main profile");
 }
});


 $('#Rvalid').click(() => {
  electron.ipcRenderer.send('Rvalid');
});

 function link(i){
  console.log(i)
  var old = $('#mainprofile').attr("uid");

  $('#a' + old).show();
  $('#lab' + old).show();
  $('#mainc').remove();
  $('#mainprofile').attr("id", null);

  $('#a' + i).hide();
  $('#lab' + i).hide();
  $('#cform' + i).append(`<span id='mainc' class="uk-label">Main profile</span>`)
  $('#cform' + i).parent().parent().attr("id", "mainprofile")

}

function check(e){
  if($('#lab' + e).attr('op') == 0) {
   $('#lab' + e).attr('op', "1");
 } else {
   $('#lab' + e).attr('op', "0");
 }
}

electron.ipcRenderer.on('mac', function(event,arg){
  electron.ipcRenderer.send('sendChar');
})

electron.ipcRenderer.on('setting', function(event,arg){
  console.log(arg)
  var modal = UIkit.modal("#modal-select");
  for (var i in arg)
   $('#selectss').append("<option>"+arg[i]+"</option>")
    modal.show();
  $('#Aselect').click(function(){
     electron.ipcRenderer.send('sendChar', $( "#selectss option:selected" ).text()); 
  })
})

  //ici ajouter les div en enlever le chargement
  electron.ipcRenderer.on('info' , function(event, arg){
    innerhtml = ` <div uid=`+i+` cid=`+arg.id+` fname=`+arg.filename+` class="">
    <div id="card`+i+`" class="uk-card uk-card-default uk-card-hover uk-card-body">
    <form id="cform`+i+`">
    <img class="uk-border-circle" width="128" height="128" src="`+arg.img+`">
    <h3 class="uk-card-title">`+arg.name+`</h3>
    <div id="lab" class=" uk-grid-small uk-child-width-1 uk-grid">
    <label id="lab`+i+`"  op=0><input onclick="check(`+i+`);" class="uk-checkbox" type="checkbox"> Select characters</label>
    <a id="a`+i+`"" class="uk-margin-top uk-button uk-button-default" onclick="link(`+i+`);">make main profile</a>
    </div>
    </form>
    </div>
    </div>`
    $('#dom').append(innerhtml);
    i++;
  });

  document.addEventListener('DOMContentLoaded', function() {
    electron.ipcRenderer.send('ready');
  });