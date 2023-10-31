document.getElementById("search").addEventListener("click" ,()=> {

    let jobTitle = document.getElementById("job-title");
    let jobCountry = document.getElementById("job-country");
    let jobCity = document.getElementById("job-city");
    let jobPostal = document.getElementById("job-postal");

    let query = "";

    if(jobTitle.value.trim() != "") {
        query += `intext:"${jobTitle.value.trim()}" `
    }

    if(jobCountry.value.trim() != "") {
        query += `AND intext:"${jobCountry.value.trim()}"`
    }

    if(jobCity.value.trim() != "") {
        query += `AND intext:"${jobCity.value.trim()}"`
    }

    if(jobPostal.value.trim() != "") {
        query += `AND intext:"${jobPostal.value.trim()}"`
    }

    if(query.trim() != "") {
        query += 'AND intext:"emploi" OR intext:"job"'
    }

    if(query.trim() != "") {
        url ='http://www.google.com/search?q=' + query;
        let job = jobTitle.value;
        if(jobCity.value.trim() != "") {
            job += " - " + jobCity.value;
        }
        addQueryUrlToStorage(job, url)
        window.open(url,'_blank');
    }
});


async function storageGetItems(key, callback) {
    chrome.storage.local.get(key, callback);
}

async function storageSaveItem(item) {
    await chrome.storage.local.set(item);
}


function addQueryUrlToStorage(jobTitle, url) {
    let item = {};
    item[new Date().getTime().toString()] = {jobTitle, url};
    storageSaveItem(item);
}

function showHistory() {
    let historyTemplate = document.getElementById("history");
    historyTemplate.innerHTML='';
    storageGetItems(null,(items) => {
        Object.keys(items).forEach(key => {
            historyTemplate.innerHTML += `
                <div class="history-item">
                   <span class="item-link" id="${key}"> ${items[key].jobTitle} </span> 
                   <span class="delete-item" id="delete-${key}"> x </span>
                </div>
            `;
        });
    });

    setTimeout(()=> {
        storageGetItems(null,(items) => {
            Object.keys(items).forEach(key => {
                document.getElementById(key).addEventListener("click", () => {
                    loadItemUrl(key);
                });
                document.getElementById("delete-"+key).addEventListener("click", () => {
                    deleteItem(key);
                });
            });
        });
    }, 1000);
}

function loadItemUrl(itemKey) {
    storageGetItems(itemKey, (item)=>{
        window.open(item[itemKey].url,'_blank');
    });
}

function deleteItem(itemKey) {
    chrome.storage.local.remove([itemKey],function(){
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
        showHistory();
    })
}

showHistory();
