window.onload = function() {
    /* Fade-in transition on visit */
    $("#app").fadeIn(1000);

    /* Downloader code */
    $("#audiobtn").on("click", () => {
        let url = $("#url").val();
        if(!url) return createAlert("Provide a URL to download from!", 3);
        createAlert("Getting video information", 4);
        fetch("/download/getinfo", {
            method: "POST",
            headers: {
                url: encodeURI(url)
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) return createAlert(data.data.message, 3);
            createAlert("Downloading audio from server", 4);
            location.href = data.audioURL;
            $("#data_title").html(data.title);
            $("#data_channel").html(data.channel);
            $("#data_iframe").attr("src", data.embed)
            $("#videoinfo").fadeIn();
        });
    });
    $("#videobtn").on("click", () => {
        let url = $("#url").val();
        if(!url) return createAlert("Provide a URL to download from!", 3);
        createAlert("Getting video information", 4);
        fetch("/download/getinfo", {
            method: "POST",
            headers: {
                url: encodeURI(url)
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.error) return createAlert(data.data.message, 3);
            createAlert("Downloading video from server", 4);
            location.href = data.videoURL;
            $("#data_title").html(data.title);
            $("#data_channel").html(data.channel);
            $("#data_iframe").attr("src", data.embed)
            $("#videoinfo").fadeIn();
        });
    });
    /* Status Query */
    let query = new URLSearchParams(window.location.search);
    let arg = query.get("s");
    switch(arg) {
        case "unavailable":
            createAlert("We weren't able to download that song", 3);
            break;
        case "invalid":
            createAlert("Invalid video URL", 2);
            break;
        case "live":
            createAlert("Sorry, live videos can't be downloaded.", 2);
            break;
    }
    
    /* Functions */
    function createAlert(message, status) {
        !message ? message = "No information provided" : undefined;
        switch(status) {
            case 1:
                $(":root").css("--alertcolor", "var(--status1)")
                $("#status").html(`<i class="fas fa-heart"></i> ${message}`)
                $("#status").fadeIn(500, function() {
                    setTimeout(() => {
                        $("#status").fadeOut(500);
                    }, 5000);
                });
                break;
            case 2:
                $(":root").css("--alertcolor", "var(--status2)")
                $("#status").html(`<i class="fas fa-exclamation-triangle"></i> ${message}`)
                $("#status").fadeIn(500, function() {
                    setTimeout(() => {
                        $("#status").fadeOut(500);
                    }, 5000);
                });
                break;
            case 3:
                $(":root").css("--alertcolor", "var(--status3)")
                $("#status").html(`<i class="fas fa-heart-broken"></i> ${message}`)
                $("#status").fadeIn(500, function() {
                    setTimeout(() => {
                        $("#status").fadeOut(500);
                    }, 5000);
                });
                break;
            case 4: 
                $(":root").css("--alertcolor", "var(--status1)")
                $("#status").html(`<i class="fas fa-circle-notch fa-spin"></i> ${message}`)
                $("#status").fadeIn(500, function() {
                    setTimeout(() => {
                        $("#status").fadeOut(500);
                    }, 5000);
                });
                break;
            case undefined:
                return console.error("Provide status");
            break;
        }
    }
}