// ==UserScript==
// @name         Not more job spamposting
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  block the spammy publishers!
// @author       You
// @match        https://www.linkedin.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=linkedin.com
// @grant        none
// ==/UserScript==


(async function() {

    'use strict';

    const sleep = ms => new Promise(res => setTimeout(res, ms));


    //contains the blocked posters
    let blockedSources = [];

    if(localStorage.getItem("blockedSources") != null){

        blockedSources = JSON.parse(localStorage.getItem("blockedSources"));
    }
    //select the the button to copy

    let threeDottedButton = null;


    async function searchButton(){
        while(threeDottedButton == null){
            await sleep(300);
            threeDottedButton = document.getElementsByClassName("msg-overlay-bubble-header__dropdown-trigger artdeco-button artdeco-button--1 artdeco-button--circle artdeco-button--muted artdeco-button--tertiary artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-top ember-view")[0];
        }
    }

    await searchButton();

    function openBlockDialog(parentButton){

        let publisher = parentButton.parentElement.children[0].children[1].children[1].children[0].innerText;

        let dialog = document.createElement('div');
        dialog.className = "artdeco-hoverable-content__shell";
        dialog.style.cssText += 'position:absolute;width:max-content;padding:0.5em;right:0;z-index:9999;'

        let dialogOption = document.createElement('div');
        dialogOption.className = "artdeco-dropdown__item artdeco-dropdown__item--is-dropdown ember-view";
        dialogOption.innerText = "block posts from "+publisher;
        dialogOption.style.cssText += 'display:flex;flex-direction:row-reverse;align-items:center;gap:1em;';
        dialogOption.addEventListener('click', (ev)=>{
            ev.preventDefault();
            blockedSources.push(publisher);
            localStorage.setItem("blockedSources", JSON.stringify(blockedSources));
            let successNotification = document.createElement('div');
            successNotification.innerText = "You will no longer see announces from "+publisher;
            successNotification.style.cssText += "color:var(--color-signal-positive);text-align:center;";
            parentButton.parentElement.replaceChildren(successNotification);
        })

        let icon = document.getElementsByClassName("job-card-container__action artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--2 artdeco-button--tertiary ember-view")[0].children[0];
        icon = icon.cloneNode(true);

        dialogOption.appendChild(icon);
        dialog.appendChild(dialogOption);


        parentButton.appendChild(dialog);
    }


    let visitedAnnounces = [];

    while(true){

        await sleep(300);

	    let jobAnnounces = null;

        jobAnnounces = document.getElementsByClassName("job-card-container__primary-description");

        for(let i = 0 ; i<jobAnnounces.length; i++){

            if(!visitedAnnounces.includes(jobAnnounces[i])){

                let newButton = threeDottedButton.cloneNode(true);

                newButton.style.cssText += 'position:absolute;right:0;bottom:0;overflow:visible;'
                newButton.addEventListener('click',()=>{
                    openBlockDialog(newButton);
                });

                jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.appendChild(newButton);
                visitedAnnounces.push(jobAnnounces[i]);
            }

            // let newButton = threeDottedButton.cloneNode(true);

            // newButton.style.cssText += 'position:absolute;bottom:0;right:0;';

            // jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.appendChild(newButton);

        if(blockedSources.includes(jobAnnounces[i].innerText) ){
                jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.style.cssText += 'display:none !important';
               console.log(jobAnnounces[i].parentElement.parentElement.parentElement.parentElement);
            }

        }

    }


})();