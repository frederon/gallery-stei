$(document).ready(function() {
  $("#lightgallery").lightGallery();
  let reference = $("#reference");
  let searching = $("#searching");

  if (reference.length && searching.length) {
    console.log("searching your face");
    prepareSearching();
  }

  async function detect(queryResults, referenceResult) {
    for (let j = 0; j < queryResults.length; j++) {
      let fd = queryResults[j].descriptor;
      const distance = await faceapi.euclideanDistance(
        referenceResult[0].descriptor,
        fd
      );
      if (distance <= 0.45) {
        return true;
      }
    }
    return false;
  }

  async function prepareSearching() {
    await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
    await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    const referenceResult = await faceapi
      .detectAllFaces("reference")
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (!referenceResult.length) {
      return;
    }

    let images = JSON.parse($("#searching").attr("data"));
    let found = [];
    for (let i = 0; i < images.length; i++) {
      searching.attr("src", "thumb/" + images[i] + "/25");
      console.log("searching " + images[i]);
      const queryResults = await faceapi
        .detectAllFaces("searching")
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (await detect(queryResults,referenceResult)) {
        showImage(images[i]);
        found.push(images[i]);
      }
      $(".meter span:first-child").css(
        "width",
        (i / images.length) * 100 + "%"
      );
    }
    saveToJSON(found);
  }

  function showImage(image) {
    console.log("show image " + image);
    let lightgallery = $("#lightgallery");
    lightgallery.append(
      `<li data-source="thumb/${image}/25" full="images/${image}"><a href><img src="thumb/${image}"></a></li>`
    );
  }

  function saveToJSON(images) {
    $.ajax({
      contentType: "application/json",
      data: JSON.stringify(images),
      dataType: "json",
      success: function(data) {
        console.log("Search saved successfully");
        window.location = "/search/" + $("#reference").attr("data");
      },
      error: function() {
        console.log("save failed");
        window.location = "/search/" + $("#reference").attr("data");
      },
      processData: false,
      type: "POST",
      url: "/search/" + $("#reference").attr("data")
    });
  }

  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".placeholder"
  });
  
  const player = new Plyr("video");
});
