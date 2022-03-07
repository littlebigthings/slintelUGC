class SETUPMIXPANEL {
    constructor() {
        this.links = document.querySelectorAll("[data-track='mxpdata']");
        this.sections = document.querySelectorAll("[section]");
        this.currUrl = document.location.href;
        this.init();
    }

    init() {
        this.sendClickedData = this.sendClickedData.bind(this);
        this.trackClicksOnLink();
        this.trackViewedSection();

    }

    trackClicksOnLink() {
        if (this.links.length > 0) {
            mixpanel.track_links(this.links, "click_landing_page", this.sendClickedData);
        }
    }

    sendClickedData(currLink) {
        if (currLink != undefined || currLink != null) {
            let linkVal = currLink.innerHTML.replaceAll(" ", "_");
            return {
                "source": linkVal.toLowerCase(),
                "url path": this.currUrl,
            }
        }
    }

    trackViewedSection() {
        this.sections.forEach(wrapper => {
        this.observer = new IntersectionObserver((wrapper) => {
            if (wrapper[0]['isIntersecting'] == true) {
                let secVal = wrapper[0].target.getAttribute("section");
                mixpanel.track("view_landing_page", {
                    "page_section": secVal,
                    "url path": this.currUrl,
                });

            }
        }, { root: null, threshold: 0.8, rootMargin: '0px' });
        this.observer.observe(wrapper);
    })
    }
}

new SETUPMIXPANEL;
// code up for review