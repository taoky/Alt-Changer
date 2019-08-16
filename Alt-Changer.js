// ==UserScript==
// @name         MSSSC-07 Img Alt Changer
// @version      0.1
// @description  Powered by Azure
// @run-at       document-end
// @author       MSSSC-07 Group
// @match        *://cuteserver.taoky.moe/*
// @grant        none
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license     MIT
// ==/UserScript==

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(500);
}

function main() {
    "use strict";

    var img_lists = document.getElementsByTagName("img");

    for (let i = 0; i < img_lists.length; i++) {
        let this_alt = img_lists[i].alt;
        let this_title = img_lists[i].title;
        let this_url = img_lists[i].src;

        console.log(this_alt, this_title, this_url);
        if (this_alt.length <= 5) {
            AnalyzeImage(this_url, img_lists[i]);
            demo()
        }
    }
}


function AnalyzeImage(sourceImageUrl, element) {
    // Request parameters.
    var params = {
        "visualFeatures": "Categories, Description",
        "details": "",
        "language": "en",
    };
    var uriBasePreRegion = "https://";
    var uriBasePostRegion = ".cognitiveservices.azure.com/vision/";
    var uriBaseAnalyze = "v1.0/analyze";
    var bing_endpoint = "https://msssc-07-bing.cognitiveservices.azure.com/bing/v7.0"
    var post_url = "/images/visualsearch"
    var threshold = 0.7

    // Perform the REST API call.
    $.ajax({
        url: uriBasePreRegion +
            "msssc-07-image" +
            uriBasePostRegion +
            uriBaseAnalyze +
            "?" +
            $.param(params),

        // Request headers.
        beforeSend: function (jqXHR) {
            jqXHR.setRequestHeader("Content-Type", "application/json");
            jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
                encodeURIComponent("YOUR_SUBSCRIPTION_KEY"));
        },

        type: "POST",

        // Request body.
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })

        .done(function (data) {
            // Show formatted JSON on webpage.
            // responseTextArea.val(JSON.stringify(data, null, 2));
            console.log(data.description);
            element.setAttribute("alt", (data.description.captions[0].confidence < threshold ? "Maybe " : "") + data.description.captions[0].text);
            console.log(data)

            if (data.description.captions[0].confidence < threshold) {
            // Bing
            $.ajax({
                url: bing_endpoint + post_url,

                // Request headers.
                beforeSend: function (jqXHR) {
                    jqXHR.setRequestHeader("Content-Type", "multipart/form-data;boundary=fjwtql");
                    jqXHR.setRequestHeader("Ocp-Apim-Subscription-Key",
                        encodeURIComponent("YOUR_SUBSCRIPTION_KEY"));
                },

                type: "POST",

                // Request body.
                data: "--fjwtql\nContent-Disposition: form-data; name=\"knowledgeRequest\"\n\n{\"imageInfo\":{\"url\":\"" + sourceImageUrl + "\"}}\n\n--fjwtql--\n",
            })

                .done(function (data) {
                    console.log("bing")
                    console.log(data)
                    var tags = data['tags']
                        for (let tag in tags) {
                            let des = tags[tag].displayName
                             if (des !== "" && des.substring(0, 2) !== "##") {
                                 element.setAttribute("alt", des);
                                 break
                             }
                        }
                })

                .fail(function (jqXHR, textStatus, errorThrown) {
                    console.warn("bing image search failed")
                });
            }

        })

        .fail(function (jqXHR, textStatus, errorThrown) {
            console.warn("vision request failed")
        });
}

main();
