function showVideo(video){

  document.getElementById("right_header").innerHTML="Video";

  var url = video.getAttribute("data-url");
  console.log(url)

  var display = document.getElementById("videoID").style.display;
  document.getElementById("videoFrame").src=url

  if(display == 'none'){
    document.getElementById("videoID").style.display = "inline";
    document.getElementById("right_header").style.display = "inline";
  }
  else{
    document.getElementById("videoID").style.display = "none";
    document.getElementById("right_header").style.display = "none";

  }



}
