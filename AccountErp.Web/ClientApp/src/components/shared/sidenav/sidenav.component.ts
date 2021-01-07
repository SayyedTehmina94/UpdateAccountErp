import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
//   function openPurchase() { 
//                     document.getElementById( 
//                       "sidebar").style.width = "250px"; 
//                     document.getElementById( 
//                       "main").style.marginLeft = "250px"; 
//                 } 

@Component({
    selector: 'app-side-nav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.css']
})
export class SideNavComponent implements OnInit {
    currentUrl = '/';
    currentMenu = "";

    constructor(private router: Router) { }

    ngOnInit(): void {
        // openPurchase();
        
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.currentUrl = event.url;
            }
        });


                var coll = document.getElementsByClassName("collapsible");
                var i;

                    for (i = 0; i < coll.length; i++) {
                    coll[i].addEventListener("click", function() {
                        this.classList.toggle("active");
                        var content = this.nextElementSibling;
                        if (content.style.display === "block") {
                        content.style.display = "none";
                        } else {
                        content.style.display = "block";
                        }
                    });
                }

                // function openPurchase() { 
                //     document.getElementById( 
                //       "sidebar").style.width = "250px"; 
                //     document.getElementById( 
                //       "main").style.marginLeft = "250px"; 
                // } 

    }
    setSubMenu(menu){
        this.currentMenu = menu;
    }
}
