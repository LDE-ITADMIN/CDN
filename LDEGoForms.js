/* global Formio, formToolServer, formDiv, redirectOnSuccessful, formToolFormId, formType, fullName, bootstrap */

var vForm = null;
var jRevision = null;
var imageHolder;
var id;
var toastContainer = document.querySelector('.toast-container');
const domain = "ldego";
var url = "not set";

window.onload = function () {
    if (formType === "build") {
        formBuilder();
    } else {
        formCreate();
    }
};

function updateRevision() {
    try {
        document.getElementById("revision").innerHTML = jRevision.major
                + "." + jRevision.minor
                + " (" + jRevision.build + ")";

    } catch (error) {
        jRevision = JSON.parse('{"major":1,"minor":0,"build":0}');
        document.getElementById("revision").innerHTML = "1.0 (0)";
        
    }
}

function formBuilder() {
    url = sessionStorage.getItem("formToolServer") + "/forms?id=" + formToolFormId;
    Formio.builder(document.getElementById(formDiv), url).then(function (form) {
        vForm = form;
        jRevision = vForm.schema.revision;
        updateRevision();
        form.on("change", function (e) {
            let jsonData = JSON.stringify(vForm.schema);
            console.log(form.schema);
        });
    });
}

function formCreate() {
    try {
        Formio.createForm(document.getElementById(formDiv), sessionStorage.getItem("formToolServer") + "/forms?id=" + formToolFormId).then(function (form) {
            vForm = form;
            autoSave();
            form.on("submit", function (submission) {
                try { 
                    showToast("Form Schema has been updated", 1);
                    console.log('Data submitted successfully.');
                    if (typeof redirectOnSuccessful === 'undefined') {
                     //   location.reload();
                    } else if(redirectOnSuccessful === "clear") {
                     
                    }else{
                      //  window.location.href = redirectOnSuccessful;
                    }
                } catch (error) {
                    alert("Error: " + error);
                }
            });

            form.on("focusd", (event) => {
                autoSave();
                var target = $(event.target);
                form.getComponent("textField").setValue(test);
                form.getComponent("select").options[form.getComponent("select").options.length] = new Option("Text 1", "Value1");
            });

            form.on("photo", (customEvent) => {
                var target = $(customEvent.target);
            });

            form.on("open", (customEvent) => {
                var target = $(customEvent.target);
            });

            form.on("click", (event) => {
                autoSave();
                try {
                    var package = "{";
                    package += '"class":"' + $(event.target).attr("class") + '"';
                    package += ',"src":"' + $(event.target).attr("src") + '"';
                    package += ',"name":"' + $(event.target).attr("name") + '"';
                    package += ',"id":"' + $(event.target).attr("id") + '"';
                    package += ',"ref":"' + $(event.target).attr("ref") + '"';
                    imageHolder = event.target;
                    package += "}";
                    id = $(event.target).attr("id");
                } catch (exception) {
                    // ldego.logDebug(exception.message);
                }
            });

            form.on("change", function (component, value) {
                autoSave();
                let jsonData = JSON.stringify(form.submission.data);
            });
        });
    } catch (error) {
        alert("Error: " + error);
    }
}

function publish() {
    jForm = vForm.schema;
    jForm.revision = jRevision;
    jRevision = jForm.revision;
    $.ajax({
        url: sessionStorage.getItem("formToolServer") + "/forms/schema/update",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify(jForm),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("X-Session", sessionStorage.getItem("x_session"));
        },
        success: function (responseData) {
            console.log("Response from server:", responseData);
            showToast("Form Schema has been updated", 1);
            jRevision = responseData.revision;
            updateRevision();
        },
        error: function (error) {
            console.error("Error:", error);
            alert("Error - " + error.toString());
        }
    });
}

function submit() {
    vForm.submit();
}

function setInputValue(inputName, inputValue) { }

function removeAsset(key, path) {
    // ldego.removeAsset(key, path);
}

function updateImage(id, path) {
    $("#" + id).attr("src", path);
}

function updateImage(id, path, width, height) {
    $("#" + id).attr("src", path);
    if (height > 0) {
        $("#" + id).attr("height", height);
    }
    if (width > 0) {
        $("#" + id).attr("width", width);
    }
}

function editAsset(key, path) {
    // ldego.log("======================= EDIT ================================>");
    // ldego.editAsset(key, path);
}

function filesUpdate(key) {
    // document.getElementById(key).innerHTML = ldego.filesToHtmlList(key);
}

function update(key, value) {
    // filesUpdate("photoDocuments");
    // ldego.message("Form now ready to be filled in or update");
    document.getElementById(key).innerHTML = value;
    setTimeout(function () {
        pleaseWait(true);
    }, 2000);
}

function pleaseWait(hide) {
    var imageDiv = document.getElementById('overlayDiv');
    if (hide) {
        imageDiv.style.display = 'none';
    } else {
        imageDiv.style.display = 'block';
    }
}

function test() {
    // test(ldego.test());
}

function test(message) {
    // ldego.message(message);
}

function saveDraft(form) {
    // ldego.saveDraft(JSON.stringify(form));
}

function requestFormData() {
    try {
        let jsonData = JSON.stringify(vForm.submission.data);
        // ldego.updateFormData(jsonData);
    } catch (error) {
        // ldego.message("error" + error);
    }
}

function autoSave() {
    try {
        let jsonData = JSON.stringify(vForm.submission.data);
        // ldego.autoSave(jsonData);
    } catch (error) {
        // ldego.message("error" + error);
    }
}

// ldego.loaded();

// setTimeout(function () {
//     var imageDiv = document.getElementById('overlayDiv');
//     imageDiv.style.display = 'none';
// }, 10000); 

function setCookie(name, value, daysToExpire) {
    const date = new Date();
    date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    const cookiePath = "path=" + ("" || "/");
    const cookieDomain = domain ? "domain=" + domain : "";
    document.cookie = name + "=" + value + "; " + expires + "; " + cookiePath + "; " + cookieDomain;
    sessionStorage.setItem(name, value);
    console.log("Stored " + name + " - " + value);
}

function getCookie(name) {
    var value = sessionStorage.getItem(name);
    console.log("Retrieved " + name + " - " + value);
    return value;
}
function showToast(message, type) {
    showToastWithDuration(message, type, 3000);
}
// Function to create and show a toast
function showToastWithDuration(message, type, duration) {
    var toastContainer = document.querySelector('.toast-container');
    // Create a new toast element
    var toast = document.createElement('div');
    toast.classList.add('toast');
    toast.classList.add('fade');
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.setAttribute('data-delay', duration);
    // Set the background color of the toast
    if (type === 0) {
        toast.setAttribute('style', 'background-color: #f44336; color: #fff');
    } else {
        toast.setAttribute('style', 'background-color: #61FF50; color: #000');
    }

    // Create the toast body
    var toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.textContent = message;
    // Append the header and body to the toast element
    toast.appendChild(toastBody);
    // Append the toast to the toast container
    toastContainer.appendChild(toast);
    // Create a new toast instance and show it
    var toastInstance = new bootstrap.Toast(toast);
    toastInstance.show();
    // Remove the toast from the DOM after it is hidden
    toast.addEventListener('hidden.bs.toast', function () {
        toast.remove();
    });
}

window.ldego = {
    me: function () {
        try {
            console.log("username");
            var json = JSON.parse(getCookie("user"));
            return json.fullName;
        } catch (error) {
            alert(error);
            alert("B " + getCookie("user"));
        }
        return "Error";
    },

};
function copyURLToClipboard() {
    copyToClipboard(url);
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
            .then(function () {
                console.log("Text copied to clipboard: " + text);
                showToastWithDuration("Copied to clipboard", 1, 1000);
            })
            .catch(function (error) {
                console.error("Error copying text to clipboard: ", error);
            });
}