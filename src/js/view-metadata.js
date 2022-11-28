/*!
    * View metadata v1.0.0
    * Easy to implement tool that displays a pages metadata.
    *
    * Copyright 2021-2022 Marshall Crosby
    * https://marshallcrosby.com
*/


(function() {
    'use strict';

    // Set multiple attributes on an element
    Element.prototype.setAttributes = function (attrs) {
        for(let key in attrs) {
            this.setAttribute(key, attrs[key]);
        }
    };

    // Parse meta entry data into html element
    function createEntryElement(attrName, attr, parent, cloneThisNode) {
        if (attr) {
            const entry = cloneThisNode.cloneNode(true);
            entry.innerHTML = /* html */`
                <span class="view-metadata-entry__attr-name">${attrName}:</span>
                <span class="view-metadata-entry__attr-value">${attr.toString()}</span>
            `;
            parent.appendChild(entry);
        }
    }

    const metaElements = document.head.querySelectorAll('meta');
    
    if (metaElements) {

        //
        // Create style tag to dump styles into for the metadata modal
        //
        
        const textStyle = document.createElement('style');
        textStyle.setAttribute('id', 'viewMetaDataStyle');

        // Import compressed styles as a string
        const textStyleString = `//=inject view-metadata.css`;

        // Apply in page styles to style tag
        textStyle.textContent = textStyleString;

        // Add in page styles to head
        document.head.appendChild(textStyle);



        //
        // Setup modal markup
        //

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
            Apply attibute(s) name and value if defined
            ----------------------------------------------- */
    
            // Charset
            createEntryElement('charset', attrs.charset, metaEntry, entryHtml);
    
            // Name
            createEntryElement('name', attrs.name, metaEntry, entryHtml);
    
            // Property
            createEntryElement('property', attrs.property, metaEntry, entryHtml);
    
            // Content
            createEntryElement('content', attrs.content, metaEntry, entryHtml);
    
            // Http-equiv
            createEntryElement('http-equiv', attrs.httpEquiv, metaEntry, entryHtml);
    
            // Itemprop
            createEntryElement('itemprop', attrs.itemprop, metaEntry, entryHtml);
        });
    
        const viewmetaEntryElement = document.querySelectorAll('.view-metadata-entry');
        const viewMetaModalBody = document.querySelector('.view-metadata__body');
    
        viewmetaEntryElement.forEach((item) => {
            viewMetaModalBody.querySelector('.view-metadata__breakdown-view-section').appendChild(item);
        });
    
    
        // Code view
        metaElements.forEach((item) => {
            const metaEntryCode = document.createElement('div');
            metaEntryCode.classList.add('view-metadata-entry');
            metaEntryCode.classList.add('view-metadata-entry--code');
            metaEntryCode.innerText = item.outerHTML.toString();
            viewMetaModalBody.querySelector('.view-metadata__code-view-section').appendChild(metaEntryCode);
        });

        const viewMetadataControls = document.querySelector('.view-metadata-overlay-controls');
        document.body.appendChild(viewMetadataControls);

        const modalShowBtn = viewMetadataControls.querySelector('.view-metadata-modal-btn');
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


        //
        // Make div(s) with role=button act like an actual button for a11y reasons
        //
        
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



