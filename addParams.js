let sendParams = {};
let checkSearch = document.location.search;
let $utm_source = document.querySelectorAll("input[name='visit_source']");
let $utm_medium = document.querySelectorAll("input[name='visit_medium']");
let $utm_campaign = document.querySelectorAll("input[name='campaign']");

function getParams(){
    if(checkSearch.length > 0){
        let paramsFromUrl = (new URL(document.location)).searchParams;
        paramsFromUrl.forEach((key, value) => {
            sendParams[`${value}`] = key;
        });
        setParams();
    }
}

function setParams(){
    if($utm_source.length>0){
        $utm_source.forEach(item => {
            if(sendParams['utm_source'] != undefined){
                item.value = sendParams['utm_source'];
            }
        })
    }
    if($utm_medium.length>0){
        $utm_medium.forEach(item => {
            if(sendParams['utm_medium'] != undefined){
            item.value = sendParams['utm_medium'];
            }
        })
    }
    if($utm_campaign.length>0){
        $utm_campaign.forEach(item => {
            if(sendParams['utm_campaign'] != undefined){
            item.value = sendParams['utm_campaign'];
            }
        })
    }
}
getParams();