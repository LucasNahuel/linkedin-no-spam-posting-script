// ==UserScript==
// @name         not turing spam posts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
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

    //select the the button to copy

    let threeDottedButton = null;


    async function searchButton(){
        while(threeDottedButton == null){
            await sleep(300);
            threeDottedButton = document.getElementsByClassName("msg-overlay-bubble-header__dropdown-trigger artdeco-button artdeco-button--1 artdeco-button--circle artdeco-button--muted artdeco-button--tertiary artdeco-dropdown__trigger artdeco-dropdown__trigger--placement-top ember-view")[0];
        }
    }
   
    await searchButton();

    function openBlockDialog(parentButton, publisher){

        let dialog = document.createElement('div');
        dialog.className = "artdeco-hoverable-content__shell";
        dialog.style.cssText += 'position:absolute;width:8em;padding:0.5em;right:0;z-index:9999;'
        dialog.innerText = "block posts from "+publisher;

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
                    console.log("open option to block");
                    openBlockDialog(newButton, jobAnnounces[i].innerText);
                });

                jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.appendChild(newButton);
                visitedAnnounces.push(jobAnnounces[i]);
            }

            // let newButton = threeDottedButton.cloneNode(true);

            // newButton.style.cssText += 'position:absolute;bottom:0;right:0;';

            // jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.appendChild(newButton);

            if(jobAnnounces[i].innerText === "Turing"){
                jobAnnounces[i].parentElement.parentElement.parentElement.parentElement.style.cssText += 'display:none !important';
                console.log(jobAnnounces[i].parentElement.parentElement.parentElement.parentElement);
            }

        }

    }

    
})();