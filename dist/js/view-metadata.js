/*!
    * View metadata v1.2.6
    * Easy to implement tool that displays a pages metadata.
    *
    * Copyright 2021-2022 Blend Interactive
    * https://blendinteractive.com
*/

(function () {
    'use strict';


    /* -----------------------------------------------
        Functions and methods
    ----------------------------------------------- */

    // Set multiple attributes on an element
    Element.prototype.setAttributes = function (attrs) {
        for (let key in attrs) {
            this.setAttribute(key, attrs[key]);
        }
    };

    // Parse meta entry data into html element
    function createBreakdownEntry(attrName, attr, parent, cloneThisNode) {
        if (attr) {
            const entry = cloneThisNode.cloneNode(true);

            entry.innerHTML = /* html */`
                <div class="view-metadata-entry__attr-name">${attrName}</div>
                <div class="view-metadata-entry__attr-value">${attr.toString()}</div>
            `;
            parent.appendChild(entry);

            // Add special attribute for property metatags
            if (attrName === 'property') {
                entry
                    .closest('.view-metadata-entry')
                    .setAttribute('data-view-md-item-property', attr.toString());
            }
        }
    }

    // Unwrap function
    function unwrap(wrapper) {
        const docFrag = document.createDocumentFragment();

        while (wrapper.firstChild) {
            const child = wrapper.removeChild(wrapper.firstChild);
            docFrag.appendChild(child);
        }

        wrapper.parentNode.replaceChild(docFrag, wrapper);
    }


    /* -----------------------------------------------
        Params
    ----------------------------------------------- */

    var scriptLinkage = document.querySelector('script[src*=view-metadata]');
    let param = {
        btnX: null,
        btnY: null,
        btnZ: null
    };

    if (scriptLinkage) {
        const urlParam = new URLSearchParams(scriptLinkage.getAttribute('src').split('?')[1]);
        param.btnX = urlParam.get('btn-x');
        param.btnY = urlParam.get('btn-y');
        param.btnZ = urlParam.get('btn-z');
    }

    const metaElements = document.head.querySelectorAll('meta');

    if (metaElements) {

        /* -----------------------------------------------
            Styling
        ----------------------------------------------- */

        const textStyle = document.createElement('style');
        textStyle.setAttribute('id', 'viewMetaDataStyle');

        // Import compressed styles as a string
        const textStyleString = `@charset "UTF-8";:root{--vmd-ff-primary:"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";--vmd-ff-code:Menlo,Consolas,"DejaVu Sans Mono",monospace;--vmd-spacing-outer-modal:10px;--vmd-border-radius-common:10px;--vmd-border-radius-small:4px;--vmd-modal-z:1000000;--vmd-body-size:13px;--vmd-color-border:rgba(0,0,0,.08);--vmd-color-text:#333;--vmd-color-gray-100:#ededed;--vmd-color-gray-200:#dedede;--vmd-chevron-down:url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='m2 5 6 6 6-6'/%3e%3c/svg%3e")}.view-metadata-styled-scrollbar{scrollbar-color:rgba(0,0,0,.25) transparent;scrollbar-width:thin}.view-metadata-styled-scrollbar::-webkit-scrollbar-corner{background-color:transparent}.view-metadata-styled-scrollbar::-webkit-scrollbar{width:7px;height:7px}.view-metadata-styled-scrollbar::-webkit-scrollbar-track{background-color:transparent}.view-metadata-styled-scrollbar::-webkit-scrollbar-thumb{border-radius:4px;outline:0;background-color:rgba(0,0,0,.25)}.js-view-metadata-modal-showing{overflow:hidden;height:100vh;scroll-behavior:smooth}.js-view-metadata-modal-showing .view-metadata{display:block;overflow-x:hidden;overflow-y:auto}.view-metadata{position:fixed;z-index:var(--vmd-modal-z);top:0;left:0;display:none;overflow-x:hidden;overflow-y:auto;width:100%;height:100%;outline:0;background-color:rgba(0,0,0,.3);font-family:var(--vmd-ff-primary);line-height:normal}.view-metadata:focus{outline:0}.view-metadata *{box-sizing:border-box;color:var(--vmd-color-text);border:0;border-radius:0;-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.view-metadata .view-metadata__dialog{position:relative;display:flex;align-items:center;width:auto;max-width:900px;min-height:calc(100% - var(--vmd-spacing-outer-modal) * 2);margin:10px auto;padding:0 var(--vmd-spacing-outer-modal)}.view-metadata .view-metadata__content{position:relative;display:flex;overflow:hidden;flex-direction:column;width:100%;pointer-events:auto;border-radius:var(--vmd-border-radius-common);outline:0;background-color:#fff;background-clip:padding-box;box-shadow:0 19px 38px rgba(0,0,0,.4);font-size:var(--vmd-body-size);font-weight:400}.view-metadata .view-metadata__body{overflow:auto;height:490px;padding:15px}.view-metadata .view-metadata__header{display:flex;align-items:center;height:53px;padding:10px 15px;border-bottom:1px solid var(--vmd-color-border);font-size:1.16666em}.view-metadata .view-metadata__title{margin-top:0;margin-bottom:10px;font-size:18px;font-weight:700}.view-metadata .view-metadata__title[aria-level="3"]{font-size:15px}.view-metadata .view-metadata__title[aria-level="4"]{font-size:var(--vmd-body-size)}.view-metadata .view-metadata__missing,.view-metadata .view-metadata__required{font-size:var(--vmd-body-size);margin-bottom:10px}.view-metadata .view-metadata__missing strong:after{content:", ";font-weight:400}.view-metadata .view-metadata__missing strong:last-child:after{content:""}.view-metadata .view-metadata__close-btn{display:flex;align-items:center;justify-content:center;width:30px;height:30px;margin-left:auto;padding:0;cursor:pointer;border-radius:50%;background-color:transparent}.view-metadata .view-metadata__close-btn svg{width:.9em;height:.9em;pointer-events:none}.view-metadata .view-metadata__close-btn svg rect{fill:currentColor}.view-metadata .view-metadata__close-btn:hover{background-color:var(--vmd-color-gray-100)}.view-metadata .view-metadata__body{font-size:var(--vmd-body-size)}.view-metadata .view-metadata__section{margin-bottom:25px}.view-metadata .view-metadata__hr{height:1px;border-top:1px solid var(--vmd-color-border);margin:0 0 20px 0}.view-metadata [hidden]+.view-metadata__hr{display:none}.view-metadata .view-metadata__code-view-section{display:none}.view-metadata .view-metadata__schema-section .view-metadata-entry{padding-left:0;margin-bottom:0;width:calc(100% - 15px);margin-left:auto}.view-metadata .view-metadata__schema-section .view-metadata-entry__item{margin-bottom:10px}.view-metadata .view-metadata__schema-section .view-metadata-entry__attr-name{flex:0 0 120px;width:120px}.view-metadata .view-metadata-schema-list{list-style-type:none;font-size:var(--vmd-body-size);padding-left:15px}.view-metadata .view-metadata-schema-list:not(:last-child){margin-bottom:30px}.view-metadata .view-metadata-schema-list .view-metadata-schema-list{margin-top:10px;margin-bottom:0}.view-metadata .view-metadata-schema-list__item{margin-bottom:10px}.view-metadata .view-metadata__rich-results-button,.view-metadata .view-metadata__schema-button{cursor:pointer;display:inline-flex;align-items:center;justify-content:center;padding:5px 14px;background-color:var(--vmd-color-gray-100);border-radius:var(--vmd-border-radius-small);font-size:var(--vmd-body-size);margin:2.5px 10px 2.5px 0;font-weight:400;height:26px}.view-metadata .view-metadata__rich-results-button svg,.view-metadata .view-metadata__schema-button svg{width:10px;height:auto;margin-left:5px}.view-metadata .view-metadata__open-graph-section .view-metadata-entry{flex-direction:row;padding-left:15px}.view-metadata .view-metadata__open-graph-section .view-metadata-entry--required:before{content:"✓";color:#9acd32;display:inline-block;width:0;overflow:visible;text-indent:-15px}.view-metadata .view-metadata__open-graph-section .view-metadata-entry__attr-value:first-child{flex:0 0 120px;width:120px;font-weight:700}.view-metadata .view-metadata__open-graph-image{width:100%;max-width:100px;height:auto}.view-metadata .view-metadata-entry{position:relative;display:flex;flex-direction:column;margin-bottom:10px;padding-left:50px}.view-metadata .view-metadata-entry.view-metadata-entry--code{padding-left:0;border:0;font-family:var(--vmd-ff-code);font-size:12px;font-weight:500;line-height:1.3}.view-metadata .view-metadata-entry__tag{position:absolute;top:2px;left:0;width:40px;opacity:.65;font-size:11px}.view-metadata .view-metadata-entry__item{display:flex;margin-bottom:2px}.view-metadata .view-metadata-entry__attr-name{flex:0 0 70px;width:70px;font-weight:700}.view-metadata-overlay-controls{position:static;overflow:visible;width:1px;height:1px}.view-metadata-modal-btn{position:absolute;top:10px;left:10px;display:flex;align-items:center;justify-content:center;width:60px;height:24px;padding:0;cursor:pointer;border:1px solid var(--vmd-color-gray-200);border-radius:4px;background-color:var(--vmd-color-gray-100);box-shadow:1px 1px 5px rgba(0,0,0,.2);font-family:var(--vmd-ff-code);font-size:12px;line-height:0;z-index:10000}.view-metadata-modal-btn:hover{box-shadow:none}
`;

        // Apply in page styles to style tag
        textStyle.textContent = textStyleString;

        // Add in page styles to head
        document.head.appendChild(textStyle);


        /* -----------------------------------------------
            Setup modal
        ----------------------------------------------- */

        const modalEl = document.createElement('div');
        modalEl.classList.add('view-metadata');

        modalEl.setAttributes({
            'id': 'viewMetadataModal',
            'aria-labelledby': 'viewMetadataModalTitle',
            'aria-modal': 'true',
            'role': 'dialog',
            'tabindex': '-1',
        });

        // Create modal dialog div
        const modalDialog = document.createElement('div');

        // Insert modal dialog element into outer modal element
        modalDialog.classList.add('view-metadata__dialog');
        modalEl.appendChild(modalDialog);

        const metadataContentHtmlString = `<div class="view-metadata__content"><div class="view-metadata__header"><div class="view-metadata__title" style="margin-bottom: 0;" id="viewMetadataModalTitle" role="heading" aria-level="2">Page metadata</div><div aria-label="Close" class="view-metadata__close-btn view-metadata--fancy-hover" role="button" tabindex="0"><svg aria-hidden="true" height="15.6px" style="enable-background:new 0 0 15.6 15.6;" viewbox="0 0 15.6 15.6" width="15.6px" x="0px" y="0px"><rect class="sty0" height="20" transform="matrix(0.7071 0.7071 -0.7071 0.7071 7.7782 -3.2218)" width="2" x="6.8" y="-2.2"></rect><rect class="sty0" height="20" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.2218 7.7782)" width="2" x="6.8" y="-2.2"></rect></svg></div></div><div class="view-metadata__body view-metadata-styled-scrollbar"><section class="view-metadata__section view-metadata__breakdown-view-section" hidden><div class="view-metadata__section-header"><div class="view-metadata__title" role="heading" aria-level="3">Meta tags</div></div></section><div class="view-metadata__hr"></div><section class="view-metadata__section view-metadata__open-graph-section" hidden><div class="view-metadata__section-header"><div class="view-metadata__title" role="heading" aria-level="3">Open Graph</div><p class="view-metadata__required"><span class="view-metadata__title" role="heading" aria-level="4">Required:</span> og:title, og:type, og:image, og:url</p><p class="view-metadata__missing" hidden><span class="view-metadata__title" role="heading" aria-level="4" style="margin-right: 5px">Missing required:</span></p></div><br></section><div class="view-metadata__hr"></div><section class="view-metadata__section view-metadata__schema-section" hidden><div class="view-metadata__section-header"><div class="view-metadata__title" role="heading" aria-level="3">Schema</div><div class="view-metadata__header-controls"><strong>Validate:</strong> &nbsp;&nbsp;<div class="view-metadata__schema-button" role="button" tabindex="0">Schema.org <svg aria-label="New window" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"/></svg></div><div class="view-metadata__rich-results-button" role="button" tabindex="0">Google Rich Results <svg aria-label="New window" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"/></svg></div></div><br></div></section><div class="view-metadata__hr"></div><section class="view-metadata__section view-metadata__code-view-section" hidden><div class="view-metadata__section-header"><div class="view-metadata__title" role="heading" aria-level="3">Code view</div></div></section></div></div><div class="view-metadata-overlay-controls"><div class="view-metadata-modal-btn" role="button" tabindex="0">&#60;meta&#62;</div></div>`;

        // Add the rest of the html string into modal dialog
        modalDialog.innerHTML = metadataContentHtmlString;
        document.body.appendChild(modalEl);

        metaElements.forEach((item) => {

            // Entries element
            const metaEntry = document.createElement('div');
            metaEntry.classList.add('view-metadata-entry');
            document.body.appendChild(metaEntry);

            // Entry title
            const metaEntryTitle = document.createElement('span');
            metaEntryTitle.classList.add('view-metadata-entry__tag');
            metaEntryTitle.innerHTML = '&#60;meta&#62;';
            metaEntry.appendChild(metaEntryTitle);

            // Create object from node attibute names and values
            const attrs = item.getAttributeNames().reduce((acc, name) => {
                return {...acc, [name]: item.getAttribute(name)};
            },{});

            // Entry element
            const entryHtml = document.createElement('div');
            entryHtml.classList.add('view-metadata-entry__item');


            /* -----------------------------------------------
                Apply attribute(s) name and value if defined
            ----------------------------------------------- */

            // Charset
            createBreakdownEntry('charset', attrs.charset, metaEntry, entryHtml);

            // Name
            createBreakdownEntry('name', attrs.name, metaEntry, entryHtml);

            // Property
            createBreakdownEntry('property', attrs.property, metaEntry, entryHtml);

            // Content
            createBreakdownEntry('content', attrs.content, metaEntry, entryHtml);

            // Http-equiv
            createBreakdownEntry('http-equiv', attrs.httpEquiv, metaEntry, entryHtml);

            // Itemprop
            createBreakdownEntry('itemprop', attrs.itemprop, metaEntry, entryHtml);
        });

        const viewMetaEntryElement = document.querySelectorAll('.view-metadata-entry');
        const viewMetaModalBody = document.querySelector('.view-metadata__body');
        const viewMetaMetaSection = viewMetaModalBody.querySelector('.view-metadata__breakdown-view-section');

        if (viewMetaEntryElement.length) {
            viewMetaMetaSection.removeAttribute('hidden');
        }

        viewMetaEntryElement.forEach((item) => {
            viewMetaMetaSection.appendChild(item);
        });


        /* -----------------------------------------------
            Render entries in the open graph section
        ----------------------------------------------- */

        const openGraphSectionEl = viewMetaModalBody.querySelector('.view-metadata__open-graph-section');
        const openGraphEntriesEl = viewMetaModalBody.querySelectorAll('.view-metadata-entry[data-view-md-item-property*="og:"]');

        if (openGraphEntriesEl.length) {
            openGraphSectionEl.removeAttribute('hidden');

            openGraphEntriesEl.forEach((item) => {
                const ogEntry = item.cloneNode(true);
                ogEntry.querySelectorAll('.view-metadata-entry__attr-name, .view-metadata-entry__tag').forEach(item => item.remove());
                ogEntry.querySelectorAll('.view-metadata-entry__item').forEach(item => unwrap(item));

                openGraphSectionEl.appendChild(ogEntry);
            });

            // Add class to required properties
            const openGraphRequiredArr = [
                'og:title',
                'og:type',
                'og:image',
                'og:url'
            ];

            openGraphRequiredArr.forEach((item) => {
                const requiredEntryEl = openGraphSectionEl.querySelector(`[data-view-md-item-property="${item}"]`);

                if (requiredEntryEl) {
                    requiredEntryEl
                        .classList
                        .add('view-metadata-entry--required');
                } else {
                    const missingEntry = document.createElement('strong');
                    const missingList = openGraphSectionEl.querySelector('.view-metadata__missing');

                    missingEntry.innerHTML = `<span style="color: red;">${item}</span>`;
                    missingList.removeAttribute('hidden');
                    missingList.appendChild(missingEntry);
                }
            });

            // Sort required entries to top of list
            const notRequiredOpenGraphEl = openGraphSectionEl.querySelectorAll('.view-metadata-entry:not(.view-metadata-entry--required)');
            notRequiredOpenGraphEl.forEach(item => openGraphSectionEl.appendChild(item));

            // Display og:image
            // const ogImage = openGraphSectionEl.querySelector('.view-metadata__open-graph-image');
            // ogImage.src = document.head.querySelector('meta[property="og:image"]').getAttribute('content');
        }


        /* -----------------------------------------------
            Render schema section
        ----------------------------------------------- */

        // Parse json to html ul
        // Special thanks to the js G.O.A.T. John Pavek https://github.com/nhawdge
        function objectToList(obj) {
            var output = '';

            for (let key of Object.keys(obj)) {
                output += `
                    <li class="view-metadata-schema-list__item">
                        <span class="view-metadata-entry__attr-name">${key}:</span>
                    `;
                if (obj[key] instanceof Object) {
                    output += `<ul class="view-metadata-schema-list"> ${objectToList(obj[key])}</ul>`;
                } else {
                    output += `<span class="view-metadata-entry__attr-value">${obj[key]}</span>`;
                }
            }

            output += '</li>';
            return output;
        }

        const schemaJson = document.querySelectorAll('[type="application/ld+json"]');

        if (schemaJson.length) {
            const schemaSectionEl = viewMetaModalBody.querySelector('.view-metadata__schema-section');
            schemaSectionEl.removeAttribute('hidden');

            schemaJson.forEach((item) => {

                // Clean up json data because for some reason it's invalid
                const jsonString = item.innerHTML.toString().trim();
                const validJson = '{' + jsonString.substring(
                    jsonString.indexOf('{') + 1, 
                    jsonString.lastIndexOf('}')
                ) + '}';

                const data = JSON.parse(validJson);

                const schemaOut = objectToList(data);
                const schemaListEl = document.createElement('ul');

                schemaListEl.classList.add('view-metadata-schema-list'); 
                schemaListEl.innerHTML = schemaOut;
                schemaSectionEl.appendChild(schemaListEl);
            });
        }

        const schemaValidateButton = viewMetaModalBody.querySelector('.view-metadata__schema-button');
        const schemaValidateUrl = `https://validator.schema.org/#url=${window.location.href}`;
        // const schemaValidateUrl = `https://validator.schema.org/#url=https://blendinteractive.com`;

        schemaValidateButton.addEventListener('click', function () {
            window.open(schemaValidateUrl, '_blank');
        });

        const richResultsButton = viewMetaModalBody.querySelector('.view-metadata__rich-results-button');
        const richResultsUrl = `https://search.google.com/test/rich-results?utm_campaign=sdtt&utm_medium=code&url=${window.location.href}`;
        // const richResultsUrl = `https://search.google.com/test/rich-results?utm_campaign=sdtt&utm_medium=code&url=https://blendinteractive.com`;

        richResultsButton.addEventListener('click', function () {
            window.open(richResultsUrl, '_blank');
        });


        /* -----------------------------------------------
            Render code view
        ----------------------------------------------- */

        metaElements.forEach((item) => {
            const metaEntryCode = document.createElement('div');
            metaEntryCode.classList.add('view-metadata-entry');
            metaEntryCode.classList.add('view-metadata-entry--code');
            metaEntryCode.innerText = item.outerHTML.toString();
            viewMetaModalBody.querySelector('.view-metadata__code-view-section').appendChild(metaEntryCode);
        });


        /* -----------------------------------------------
            Modal button
        ----------------------------------------------- */

        const viewMetadataControls = document.querySelector('.view-metadata-overlay-controls');
        document.body.appendChild(viewMetadataControls);

        const modalShowBtn = viewMetadataControls.querySelector('.view-metadata-modal-btn');

        if (param.btnX !== null) {
            modalShowBtn.style.right = 'auto';
            modalShowBtn.style.left = param.btnX;
        }

        if (param.btnY !== null) {
            modalShowBtn.style.top = param.btnY;
        }

        if (param.btnZ !== null) {
            modalShowBtn.style.zIndex = param.btnZ;
        }

        modalShowBtn.addEventListener('click', () => {
            modalShow();
        });

        // Hide modal
        function modalHide() {
            document.documentElement.classList.remove('js-view-metadata-modal-showing');
            focusedElementBeforeModal.focus();
        }

        const modalCloseBtn = document.querySelector('.view-metadata__close-btn');
        modalCloseBtn.addEventListener('click', () => {
            modalHide();
        });

        // Hide modal with esc key
        modalEl.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && document.documentElement.classList.contains('js-view-metadata-modal-showing')) {
                modalHide();
            }
        });

        // Hide modal by clicking outside of it
        const modalContent = document.querySelectorAll('.view-metadata__content');
        modalEl.addEventListener('mousedown', function (event) {
            let isClickInside = false;

            modalContent.forEach((item) => {
                if (item.contains(event.target)) {
                    isClickInside = true;
                }
            });

            if (!isClickInside && document.documentElement.classList.contains('js-view-metadata-modal-showing')) {
                modalHide();
            }
        });

        // Show modal
        let focusedElementBeforeModal;
        function modalShow() {
            document.documentElement.classList.add('js-view-metadata-modal-showing');

            // Save current focus
            focusedElementBeforeModal = document.activeElement;

            // Listen for and trap the keyboard
            modalEl.addEventListener('keydown', trapTabKey);

            // Find all focusable children
            let focusableElementsString =`
                a[href],
                area[href],
                input,
                select:not([disabled]),
                textarea:not([tabindex="-1"]),
                button:not([disabled]),
                iframe,
                object,
                embed,
                [tabindex="0"],
                [contenteditable],
                [role="button"]
            `;

            let focusableElements = modalEl.querySelectorAll(focusableElementsString);

            // Convert NodeList to Array
            focusableElements = Array.prototype.slice.call(focusableElements);

            const firstTabStop = focusableElements[0];
            const lastTabStop = focusableElements[focusableElements.length - 1];

            // Set initial focus on the modal
            modalEl.focus();

            function trapTabKey(event) {

                // Check for TAB key press
                if (event.keyCode === 9) {

                    // SHIFT + TAB
                    if (event.shiftKey) {
                        if (document.activeElement === firstTabStop) {
                            event.preventDefault();
                            lastTabStop.focus();
                        }

                    // TAB
                    } else {
                        if (document.activeElement === lastTabStop) {
                            event.preventDefault();
                            firstTabStop.focus();
                        }
                    }
                }
            }
        }


        /* -----------------------------------------------
            Make div(s) with role=button act like an
            actual button for a11y reasons
        ----------------------------------------------- */

        document.querySelectorAll('.view-metadata__close-btn, .view-metadata-modal-btn, .view-metadata__schema-button').forEach((item) => {
            item.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }

    // javascript:var v = '1.2.5'; var el = document.getElementById('viewMetadataModal'); if (!el) {var s = document.createElement('script');s.type='text/javascript';document.body.appendChild(s);s.src=`https://cdn.jsdelivr.net/gh/marshallcrosby/view-metadata@${v}/dist/js/view-metadata.min.js`;void(0);s.addEventListener('load',function(){document.querySelector('.view-metadata-modal-btn').click()})} else {document.querySelector('.view-metadata-modal-btn').click()};
})();




//# sourceMappingURL=view-metadata.js.map
