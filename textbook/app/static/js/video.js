function showVideo(){
  document.getElementById("right_header").innerHTML="Video";

  var display = document.getElementById("videoID").style.display;

  if(display == 'none'){
    document.getElementById("videoID").style.display = "inline";
    document.getElementById("right_header").style.display = "inline";
  }
  else{
    document.getElementById("videoID").style.display = "none";
    document.getElementById("right_header").style.display = "none";

  }
}
