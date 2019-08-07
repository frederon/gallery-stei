$(document).ready(function() {
  $("#lightgallery").lightGallery();
  let reference = $("#reference");
  let searching = $("#searching");
  if (reference.length && searching.length) {
    console.log("searching your face");
    async function detect() {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");

      const results = await faceapi
        .detectAllFaces("reference")
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (!results.length) {
        return;
      }

      const faceMatcher = new faceapi.FaceMatcher(results);
      let images = JSON.parse($("#searching").attr("data"));
      let resImages = [];
      for (let i = 0; i < images.length; i++) {
        searching.attr("src", "thumb/" + images[i] + "/25");
        console.log("searching " + images[i]);
        const singleResult = await faceapi
          .detectSingleFace("searching")
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (singleResult) {
          const bestMatch = faceMatcher.findBestMatch(
            singleResult.descriptor
          );
          if(parseFloat(
              bestMatch.toString().substring(bestMatch.toString().length - 4)
            ) <= 0.45) {
            showImage(images[i]);
            resImages.push(images[i]);
          };
        }
        $('.meter span:first-child').css('width', i / images.length * 100 + "%");
      }
      saveToJSON(resImages);
    }
    detect();
  }
  function showImage(image) {
    console.log("show image" + image)
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
});