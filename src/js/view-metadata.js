/*!
    * View metadata v1.2.3
    * Easy to implement tool that displays a pages metadata.
    *
    * Copyright 2021-2022 Blend Interactive
    * https://blendinteractive.com
*/

(function() {
    'use strict';


    /* -----------------------------------------------
        Functions and methods
    ----------------------------------------------- */

    // Set multiple attributes on an element
    Element.prototype.setAttributes = function (attrs) {
        for(let key in attrs) {
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

    const scriptLinkage = document.getElementById('view-metadata-js') || document.querySelector('script[src*=view-metadata]');
    const param = {
        btnX: null,
        btnY: null,
        btnZ: null
    }

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
        const textStyleString = `//=inject view-metadata.css`;

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

        const metadataContentHtmlString = `//=inject _view-metadata-markup.html`;

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
        }
        

        /* -----------------------------------------------
            Render schema section
        ----------------------------------------------- */

        // Parse json to html ul
        // Special thanks to John Pavek https://github.com/nhawdge
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

                schemaListEl.classList.add('view-metadata-schema-list')
                schemaListEl.innerHTML = schemaOut;
                schemaSectionEl.appendChild(schemaListEl);
            });
        }


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
        
        document.querySelectorAll('.view-metadata__close-btn, .view-metadata-modal-btn').forEach((item) => {
            item.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.code === 'Space') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }
})();



