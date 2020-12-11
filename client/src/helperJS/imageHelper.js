// A function to send a POST request with a new image
export const addImage = (app, form, referenceId, usrOrLoc) => {
    // the URL for the request
    const url = "/images";

    // The data we are going to send in our request
    const data = new FormData(form);
    data.append("referenceId", referenceId)

    const request = new Request(url, {
        method: "post",
        body: data
    });
    fetch(request)
        .then(function (res) {
            if (res.status === 200) {
                return res.json();
            }
        })
        .then(json => {
          const requestUpdateReviews = new Request(`/api/reviews/${usrOrLoc}/${referenceId}`, {
            method: "PATCH",
            body: JSON.stringify({
              imagePath: json.url
            }),
            headers: {
                Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json"
            }
          });
          // Send the request with fetch()
          fetch(requestUpdateReviews)
              .then((res) => {
                  if (res.status === 200) {
                      alert('Image updated.');
                      app.props.history.push(`/`);
                      app.props.history.push(`/${usrOrLoc}/${referenceId}`);
                  }
              }).catch((error) => {
                  console.log(error);
              });
        })
        .catch(error => {
            console.log(error);
        });
};

// A function to send a DELETE request with an image PUBLIC id (id on cloudinary)
export const deleteImage = (imageId, dashboardComp, imageListComp) => {
    // the URL for the request
    const url = `/images/${imageId}`;

    // Create our request constructor with all the parameters we need
    const request = new Request(url, {
        method: "delete",
    });

    // Send the request with fetch()
    fetch(request)
        .then(function (res) {
            // Handle response we get from the API.
            // Usually check the error codes to see what happened.
            if (res.status === 200) {
                // If image was deleted successfully, tell the user.
                dashboardComp.setState({
                    message: {
                        body: "Delete successful.",
                        type: "success"
                    }
                });

                // Also remove the image from the imageList state
                // Use filter to only keep the images you want.
                const filteredList = imageListComp.state.imageList.filter(img => img.image_id !== imageId);
                imageListComp.setState(
                    { imageList: filteredList }
                );

            } else {
                // If server couldn't delete the image, tell the user.
                // Here we are adding a generic message, but you could be more specific in your app.
                dashboardComp.setState({
                    message: {
                        body: "Error: Could not delete image.",
                        type: "error"
                    }
                });
            }
        })
        .catch(error => {
            console.log(error);
        });
}
