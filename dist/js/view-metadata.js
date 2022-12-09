/*!
    * View metadata v1.0.1
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

        //
        // Create style tag to dump styles into for the metadata modal
        //
        
        const textStyle = document.createElement('style');
        textStyle.setAttribute('id', 'viewMetaDataStyle');

        // Import compressed styles as a string
        const textStyleString = `:root{--vmd-ff-primary:"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";--vmd-ff-code:Menlo,Consolas,"DejaVu Sans Mono",monospace;--vmd-spacing-outer-modal:10px;--vmd-border-radius-common:10px;--vmd-modal-z:1000000;--vmd-color-border:rgba(0,0,0,.05);--vmd-color-text:#333;--vmd-color-gray-100:#ededed;--vmd-color-gray-200:#dedede}.view-metadata-styled-scrollbar{scrollbar-color:rgba(0,0,0,.25) transparent;scrollbar-width:thin}.view-metadata-styled-scrollbar::-webkit-scrollbar-corner{background-color:transparent}.view-metadata-styled-scrollbar::-webkit-scrollbar{width:7px;height:7px}.view-metadata-styled-scrollbar::-webkit-scrollbar-track{background-color:transparent}.view-metadata-styled-scrollbar::-webkit-scrollbar-thumb{border-radius:4px;outline:0;background-color:rgba(0,0,0,.25)}.js-view-metadata-modal-showing{overflow:hidden;height:100vh;scroll-behavior:smooth}.js-view-metadata-modal-showing .view-metadata{display:block;overflow-x:hidden;overflow-y:auto}.view-metadata{position:fixed;z-index:var(--vmd-modal-z);top:0;left:0;display:none;overflow-x:hidden;overflow-y:auto;width:100%;height:100%;outline:0;background-color:rgba(0,0,0,.3);font-family:var(--vmd-ff-primary);line-height:normal}.view-metadata:focus{outline:0}.view-metadata *{box-sizing:border-box;color:var(--vmd-color-text);border:0;border-radius:0;-webkit-font-smoothing:auto;-moz-osx-font-smoothing:auto}.view-metadata .view-metadata__dialog{position:relative;display:flex;align-items:center;width:auto;max-width:900px;min-height:calc(100% - var(--vmd-spacing-outer-modal) * 2);margin:10px auto;padding:0 var(--vmd-spacing-outer-modal)}.view-metadata .view-metadata__content{position:relative;display:flex;overflow:hidden;flex-direction:column;width:100%;pointer-events:auto;border-radius:var(--vmd-border-radius-common);outline:0;background-color:#fff;background-clip:padding-box;box-shadow:0 19px 38px rgba(0,0,0,.4);font-size:13px}.view-metadata .view-metadata__body{overflow:auto;height:490px;padding:15px}.view-metadata .view-metadata__header{display:flex;align-items:center;height:53px;padding:10px 15px;border-bottom:1px solid var(--vmd-color-border);font-size:1.16666em}.view-metadata .view-metadata__title{margin-top:0;font-size:18px;font-weight:500}.view-metadata .view-metadata__title[aria-level="3"]{font-size:14px}.view-metadata .view-metadata__close-btn{display:flex;align-items:center;justify-content:center;width:30px;height:30px;margin-left:auto;padding:0;cursor:pointer;border-radius:50%;background-color:transparent}.view-metadata .view-metadata__close-btn svg{width:.9em;height:.9em;pointer-events:none}.view-metadata .view-metadata__close-btn svg rect{fill:currentColor}.view-metadata .view-metadata__close-btn:hover{background-color:var(--vmd-color-gray-100)}.view-metadata .view-metadata__body{font-size:13px}.view-metadata .view-metadata__breakdown-view-section{margin-bottom:40px}.view-metadata .view-metadata-entry{position:relative;display:flex;flex-direction:column;margin-bottom:10px;padding-left:50px}.view-metadata .view-metadata-entry.view-metadata-entry--code{padding-left:0;border:0;font-family:var(--vmd-ff-code);font-size:12px;font-weight:500;line-height:1.3}.view-metadata .view-metadata-entry__tag{position:absolute;top:2px;left:0;width:40px;opacity:.65;font-size:11px}.view-metadata .view-metadata-entry__item{display:flex;margin-bottom:2px}.view-metadata .view-metadata-entry__attr-name{flex:0 0 70px;width:70px;font-weight:700}.view-metadata-overlay-controls{position:static;overflow:visible;width:1px;height:1px}.view-metadata-modal-btn{position:absolute;top:10px;right:10px;display:flex;align-items:center;justify-content:center;width:60px;height:24px;padding:0;cursor:pointer;border:1px solid var(--vmd-color-gray-200);border-radius:4px;background-color:var(--vmd-color-gray-100);box-shadow:1px 1px 5px rgba(0,0,0,.2);font-family:var(--vmd-ff-code);font-size:12px;line-height:0}.view-metadata-modal-btn:hover{box-shadow:none}
`;

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

        const metadataContentHtmlString = `<div class="view-metadata__content"><div class="view-metadata__header"><div class="view-metadata__title" id="viewMetadataModalTitle" role="heading" aria-level="2">Page metadata</div><div aria-label="Close" class="view-metadata__close-btn view-metadata--fancy-hover" role="button" tabindex="0"><svg aria-hidden="true" height="15.6px" style="enable-background:new 0 0 15.6 15.6;" viewbox="0 0 15.6 15.6" width="15.6px" x="0px" y="0px"><rect class="sty0" height="20" transform="matrix(0.7071 0.7071 -0.7071 0.7071 7.7782 -3.2218)" width="2" x="6.8" y="-2.2"></rect><rect class="sty0" height="20" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -3.2218 7.7782)" width="2" x="6.8" y="-2.2"></rect></svg></div></div><div class="view-metadata__body view-metadata-styled-scrollbar"><section class="view-metadata__breakdown-view-section"><h3 class="view-metadata__title" aria-level="3">Breakdown view:</h3></section><section class="view-metadata__code-view-section"><h3 class="view-metadata__title" aria-level="3">Code view:</h3></section></div></div><div class="view-metadata-overlay-controls"><div class="view-metadata-modal-btn" role="button" tabindex="0">&#60;meta&#62;</div></div>`;

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



//# sourceMappingURL=view-metadata.js.map
