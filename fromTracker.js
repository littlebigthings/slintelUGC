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
        // checkfield:{
        //         department:{
        //             "sales":"sdcbsdscsdsbcsdyb",
        //             "marketing":"sdcbsdscsdsbcsdyb",
        //         },
        // }, 
    },
    "30fa9a91-ea3d-47a0-b96a-784c9b4c7e24": {
        startForm: false,
        isFormReady: false,
        // checkfield:{
        //         department:{
        //             "sales":"sdcbsdscsdsbcsdyb",
        //             "marketing":"sdcbsdscsdsbcsdyb",
        //         },
        // }, 
    },
    "42f54135-7546-4b34-9c5a-750d18296001": {
        startForm: false,
        isFormReady: false,
        // checkfield:{
        //         department:{
        //             "sales":"sdcbsdscsdsbcsdyb",
        //             "marketing":"sdcbsdscsdsbcsdyb",
        //         },
        // }, 
    },
    "5349bbf8-afb0-4ec6-a18a-f7b6f4aabaf4": {
        startForm: false,
        isFormReady: false,
        // checkfield:{
        //         department:{
        //             "sales":"sdcbsdscsdsbcsdyb",
        //             "marketing":"sdcbsdscsdsbcsdyb",
        //         },
        // }, 
    },
}

//put first form first.
/**
 * webflow design: 2 days,
 * formDesign: 1 day,
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
 * function pick the wrapper clone it add form into to and add an attribute this will be form id so that we can uniquely target them.
 */

class HSBFORMS {
    constructor(formObj) {
        this.formObj = formObj;
        this.mainWrapper = document.querySelector('.form-component');
        this.formWrapper = this.mainWrapper.querySelector('.embed-form-super-wrapper');
        this.init();
    }
    init() {
        this.sendFormToInject();
        this.listenReadyForms();
        // this.openForm();
        // this.addListener();
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
            console.log(error);
        }
    }

    listenReadyForms() {
        let readyFormsLen = 0;
        let formsLen = Object.keys(this.formObj).length;
        window.addEventListener('message', event => {
            if (event.data.eventName === 'onFormReady') {
                this.formObj[event.data.id].isFormReady = true;
                readyFormsLen +=1;
                if(readyFormsLen == formsLen){
                    // this.formObj["5349bbf8-afb0-4ec6-a18a-f7b6f4aabaf4"].isFormReady = false;
                    this.checkReadyForms();
                    this.addListener();
                }
            }
        });
    }

    checkReadyForms() {
        Object.keys(this.formObj).forEach(key => {
            // console.log(this.formObj[key].isFormReady == true)
            if (this.formObj[key].isFormReady) {
                this.openForm(key, this.formObj[key].startForm);

            }
            else{
                // call show error function here.
                console.log("not Ready");

            }
        });
    }
    openForm(formId, showFirst) {
        // console.log(formId)
        // let key = Object.keys(this.formObj)[0];
        let formToView = document.querySelector(`[formId='${formId}']`);
        if(!showFirst){
            formToView.style.display = "none";
        }
        // let formsToHide = this.mainWrapper.querySelectorAll("[formId]");
        // formsToHide.forEach(wrapper => {
        //     if (wrapper !== formToView) {
        //         wrapper.style.display = "none";
        //     }
        // })
    }

    addListener(){
        // console.log("added")
        window.addEventListener('message', event => {
            if(event.data.eventName === 'onFormSubmit') {
                console.log(event.data)
                let subForm = this.formObj[event.data.id];
                let filledForm = event.data;
                if(subForm.checkfield !== undefined){
                    let checkfield = Object.getOwnPropertyNames(subForm.checkfield);
                    filledForm.data.forEach(data => {
                        if(checkfield.includes(data.name)){
                            let selectCheckField = checkfield.find(field => field == data.name)
                            let nextFormToOpen = subForm.checkfield[selectCheckField][data.value];
                            console.log(selectCheckField)
                            console.log(nextFormToOpen)
                            // set next form to open
                        }
                    })
                    // console.log(this.formObj[event.data.id].checkfield[index])
                }
                // console.log(Object.keys(event.data).length)
            }
            else if(event.data.eventName === 'onFormSubmitted'){
                //call funciton to open next form.
            }
         });
    }
}
// test cases.
// if forms are not getting load in the DOM from hubspot then what??

new HSBFORMS(objForm);