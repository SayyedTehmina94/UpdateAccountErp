import { Component, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

import { ListenerService } from '../services';
import { AppUtils } from '../helpers/app.utils';
declare var appConfig: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  routerSubscription: Subscription;
  currentUrl: string;
  layoutType = 1;

  constructor(private router: Router,
    private renderer2: Renderer2,
    private appUtils: AppUtils,
    private listenerService: ListenerService,
    datepickerConfig: NgbDatepickerConfig) {

    this.subscription = this.listenerService
      .listenLayout
      .subscribe(() => {
        if (this.appUtils.isUserAuthenticated()) {
          this.renderer2.addClass(document.body, 'enabled');
          this.renderer2.addClass(document.body, 'fixed');
        } else {
          this.renderer2.removeClass(document.body, 'enabled');
          this.renderer2.removeClass(document.body, 'fixed');
        }
      });

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        setTimeout(() => {
          appConfig.adjustContainerHeight();
          this.appUtils.scrollToTop();
        });

        this.currentUrl = event.url;

        if (this.currentUrl.indexOf('/account/login') !== -1) {
          this.layoutType = 0;
          this.renderer2.removeClass(document.body, 'enabled');
          this.renderer2.removeClass(document.body, 'fixed');
        } else if (this.appUtils.isUserAuthenticated()) {
          this.layoutType = 1;
          this.renderer2.addClass(document.body, 'enabled');
          this.renderer2.addClass(document.body, 'fixed');
        }
      }
    });

    const currentDate = new Date();
    datepickerConfig.minDate = { year: 1900, month: 1, day: 1 };
    datepickerConfig.maxDate = { year: currentDate.getFullYear() + 1, month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    datepickerConfig.outsideDays = 'collapsed';
  }

  ngOnInit() {
    setTimeout(() => {
      appConfig.initDefaults();
    });

    window.addEventListener('storage', (event) => {
      if (event.storageArea === localStorage) {
        const token = localStorage.getItem('AuthToken');
        if (token === null || token === undefined) {
          this.router.navigate(['/account/login']);
        } else {
        }
      }
    }, false);

    $(document).ready(function () {
 
      $(document).on('click', '.nav-collapse-btn-lg', function(){
        console.log("upper");
        $("#smtsidebar").toggleClass("bar-collapse");
        // return false;
        // $('body').toggleClass("sidebar-collapse");
      });
      $(document).on('click', '.customMenu', function(){
        $(".sidebar").toggleClass("bar-collapse");
        // return false;
        // $('body').toggleClass("sidebar-collapse");
      });
      $(document).on('click', '.customMenu1', function(){
        $(".sidebar").removeClass("bar-collapse");
        // return false;
        // $('body').toggleClass("sidebar-collapse");
      });
      $(document).on('click', '.btn-close', function(){
        $(".sidebar").toggleClass("bar-collapse");
        // return false;
        // $('body').toggleClass("sidebar-collapse");
      });
    
      if ($(window).width() <= 767) {
        $('.card-body ul li a').click(function () {
          $('.gray-area').hide(200);
          $('.detail-area').show(200);
        });
        $('.detail-back-btn').click(function () {
          $('.gray-area').show(200);
          $('.detail-area').hide(200);
        });
    
      }
    });
    
    function setNav() {
      if ($(window).width() < 767) {
        $("div#demo").addClass("collapse");
      } else {
        $("div#demo").removeClass("collapse");
      }
    }
    setNav();
    $(window).resize(function () {
      setNav();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
