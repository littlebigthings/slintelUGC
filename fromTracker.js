const objForm = {
    "f77120a7-8435-4aa2-8ee1-7c4c9e273f76": {
        startForm: true,
        isFormReady: false,
        checkfield: {
            department: {
                "Sales": "30fa9a91-ea3d-47a0-b96a-784c9b4c7e24",
                "Business Development": "30fa9a91-ea3d-47a0-b96a-784c9b4c7e24",
                "Marketing": "42f54135-7546-4b34-9c5a-750d18296001",
                "Human Resources": "5349bbf8-afb0-4ec6-a18a-f7b6f4aabaf4",
            },
        },
    },
    "89c0b68e-6c86-45c9-9c1a-b66537cf8f94": {
        startForm: false,
        isFormReady: false,
    },
    "30fa9a91-ea3d-47a0-b96a-784c9b4c7e24": {
        startForm: false,
        isFormReady: false,
    },
    "42f54135-7546-4b34-9c5a-750d18296001": {
        startForm: false,
        isFormReady: false,
    },
    "5349bbf8-afb0-4ec6-a18a-f7b6f4aabaf4": {
        startForm: false,
        isFormReady: false,
    },
}

const redirectLink = "/thank-you-two";
//put first form first.
/**
 * webflow design: 2 days done,
 * formDesign: 1 day done,
 * form flow logic: 2 days,
 * form testing + changes : 1 day,
 */

/**
 * finish styling of forms.
 * move to page design.
 * after finish inform vineet for review (2 mem of LBT).
 * start functionlity.
 *  */
/**
 * schedule a call with saif on monday about hsb logic confirmation done.
 * function pick the wrapper clone it add form into to and add an attribute this will be form id so that we can uniquely target them.
 */

class HSBFORMS {
    constructor(formObj, redirectLink) {
        this.formObj = formObj;
        this.redirectTo = redirectLink;
        this.mainWrapper = document.querySelector("[wrapper='forms']");
        this.formWrapper = this.mainWrapper.querySelector('.embed-form-super-wrapper');
        this.popupWrapper = document.querySelector("[wrapper='popup']")
        this.termsWrapper = this.popupWrapper.querySelector("[wrapper='termswrapper']");
        this.takeSurveyBtn = [...document.querySelectorAll("[takesurvey]")];
        this.startSurveyBtn = this.termsWrapper.querySelector("[startsurvey]");
        this.closeBtnToClone = this.popupWrapper.querySelector("[btn='close']");
        this.errorBlock = this.popupWrapper.querySelector("[wrp='error']");
        this.tryAgainCta = this.errorBlock.querySelector("[btn='tryagain']");
        this.nextFormToOpen = null;
        this.submittedFormId = null;
        this.isConnected = true;
        this.takeSurveyBtnStatus = "notClicked";
        this.init();
    }
    init() {
        this.checkConnection();
        this.sendFormToInject();
        this.listenReadyForms();
    }

    btnListener() {
        if (this.takeSurveyBtn.length != 0) this.takeSurveyBtn.forEach(btn => {
            if (btn !== undefined && btn !== null) btn.addEventListener("click", (e) => {
                this.openClosePopup(e.target);
                // this.takeSurveyBtnStatus = "clicked";
            })
        })

        if (this.startSurveyBtn !== undefined && this.startSurveyBtn !== null)this.startSurveyBtn.addEventListener("click", (e) => {

            // this.takeSurveyBtnStatus = "started";
            if (this.takeSurveyBtn.length != 0) {
                this.takeSurveyBtn.forEach(btn => {
                    btn.setAttribute("takesurvey", "started")
                    btn.innerHTML = "Continue Survey";
                });
            }
            this.openClosePopup(e.target);
        })

        if (document.querySelectorAll("[btn='close']").length != 0) {
            document.querySelectorAll("[btn='close']").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    this.openClosePopup(e.target);
                })
            })
        }

        if (this.tryAgainCta !== undefined && this.tryAgainCta !== null) {
            this.tryAgainCta.addEventListener("click", () => {
                location.reload();
            })
        }
    }

    openClosePopup(target) {

        if (this.takeSurveyBtn.includes(target)) {

            this.popupWrapper.classList.remove("hide-popup");
            if (target.getAttribute("takesurvey") == "firsttime" || target.getAttribute("takesurvey") == "notClicked") {
                this.takeSurveyBtnStatus = "clicked";
                this.termsWrapper.classList.remove("hide");
            }
            else if (target.getAttribute("takesurvey") == "started") {
                this.takeSurveyBtnStatus = "started";
                this.mainWrapper.classList.remove("hide");
            }
            else if (target.getAttribute("takesurvey") == "failed") {
                this.showError();
            }
        }

        else if (target == this.startSurveyBtn) {
            this.termsWrapper.classList.add("hide");
            this.mainWrapper.classList.remove("hide");
        }

        else {
            this.popupWrapper.classList.add("hide-popup");
        }
    }

    sendFormToInject() {
        Object.keys(this.formObj).forEach(key => {
            this.createFormWrapper(key);
        })
    }

    createFormWrapper(key) {
        const clonedFormWrapper = this.formWrapper.cloneNode(true);
        clonedFormWrapper.setAttribute('formId', `${key}`);
        this.mainWrapper.appendChild(clonedFormWrapper);
        this.addForms(key);
        this.formWrapper.remove();
    }

    addForms(key) {
        try {
            hbspt.forms.create({
                region: "na1",
                portalId: "7119044",
                formId: key,
                target: `[formId='${key}']`,
            });
        }
        catch (error) {
            // call show error function here.
            this.showError()
            console.log(error);
        }
    }

    listenReadyForms() {
        let readyFormsLen = 0;
        let formsLen = Object.keys(this.formObj).length;
        window.addEventListener('message', event => {
            if (event.data.eventName === 'onFormSubmitted') {
                //call funciton to open next form.
                if (this.nextFormToOpen != null) {
                    this.openNextForm();
                }
                else {
                    window.location.href = this.redirectTo;
                }
            }
            else if (event.data.eventName == "onFormDefinitionFetchError") {
                this.showError();
                this.btnListener();
            }
            else if (event.data.eventName === 'onFormReady') {
                this.formObj[event.data.id].isFormReady = true;
                readyFormsLen += 1;
                if (readyFormsLen == formsLen) {
                    this.checkReadyForms();
                    this.btnListener();
                }
            }
            else if (event.data.eventName === 'onFormSubmit') {
                this.submittedFormId = event.data.id;
                let subForm = this.formObj[event.data.id];
                let filledForm = event.data;
                if (subForm.checkfield !== undefined) {
                    let checkfield = Object.getOwnPropertyNames(subForm.checkfield);
                    filledForm.data.forEach(data => {
                        if (checkfield.includes(data.name)) {
                            let selectCheckField = checkfield.find(field => field == data.name)
                            this.nextFormToOpen = subForm.checkfield[selectCheckField][data.value];
                            console.log(selectCheckField)
                            console.log(this.nextFormToOpen)
                        }
                    })
                } else {
                    this.nextFormToOpen = null;
                }
            }

        });
    }

    checkReadyForms() {
        Object.keys(this.formObj).forEach(key => {
            if (this.formObj[key].isFormReady) {
                this.openForm(key, this.formObj[key].startForm);

            }
            else {
                // call show error function here.
                // add custom error message if config went wrong.
                this.showError();
                console.log("not Ready");

            }
        });
    }
    openForm(formId, showFirst) {
        let formToView = document.querySelector(`[formId='${formId}']`);
        // adding close btn here into the form
        if(formToView != undefined || formToView != null){
            formToView.appendChild(this.closeBtnToClone.cloneNode(true));
            if (!showFirst) {
                formToView.style.display = "none";
            }
        }
    }


    openNextForm() {
        let formToHide = document.querySelector(`[formId='${this.submittedFormId}']`);
        let formToShow = document.querySelector(`[formId='${this.nextFormToOpen}']`);

        if (formToHide != undefined || formToHide != null) formToHide.style.display = "none";
        if (formToShow != undefined || formToShow != null) formToShow.style.display = "block";
    }

    showError() {
        this.popupWrapper.classList.remove("hide-popup");
        this.popupWrapper.childNodes.forEach(child => {
            if(child.style.display != "none"){
                child.classList.add("hide");
            }
        })
        this.errorBlock.classList.remove("hide");
        this.takeSurveyBtn.forEach(btn => {
            btn.setAttribute("takesurvey", "failed");
        })
    }

    checkConnection() {
        window.addEventListener('online', () => {
            if (!this.isConnected) {
                if(this.takeSurveyBtn.length != 0)this.takeSurveyBtn.forEach(btn => {
                    btn.setAttribute("takesurvey", this.takeSurveyBtnStatus);
                })
                this.isConnected = true;
                this.errorBlock.classList.add("hide");
                if(this.takeSurveyBtnStatus == "clicked"){
                    this.termsWrapper.classList.remove("hide");
                }
                else if(this.takeSurveyBtnStatus == "started"){
                    this.mainWrapper.classList.remove("hide");
                }
                else{
                    this.popupWrapper.classList.add("hide-popup")
                }
            }
        });
        window.addEventListener('offline', () => {
            this.isConnected = false;
            this.showError();
        });
    }
}

new HSBFORMS(objForm, redirectLink);