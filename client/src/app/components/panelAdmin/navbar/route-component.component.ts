import { Component, OnInit, OnDestroy, Output, EventEmitter, LOCALE_ID, Inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ApiClientService, API_URI_NOTIFICATIONS, API_URI_USER, API_URI_ACCOUNT } from 'src/app/api-client/api-client.service';
import { DecryptTokenService } from '../../home/register/register.service';
import {SelectedLanguageService} from '../../../services/selected-language.service';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { NotificationService } from 'src/app/services/notification.service';
import { Observable, Subscription, timer } from 'rxjs';
import { map, share, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-route-component',
  templateUrl: './route-component.component.html',
  styleUrls: ['./route-component.component.scss']
})
export class RouteComponentComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  user: any;
  account: any;
  paymentCard: any;
  isProfesionalAccount = false;

  isShowNavCompte = false;
  isShowNavTesting = false;
  isShow = false;
  isShow2 = false;
  public offer_id: any;
  public viewcontentDefaults: boolean;
  public notifUnread = 0;
  public activeMenuB = false;
  public currentLanguage;
  public lang = 'en';
  public isTablet = false;
  public notifications$: Observable<Record<string, any>[]>;
  public otherLanguage = [
    {
      codelang: 'fr', shortlang: 'fr', img: '../../../../assets/drapeau/france-flag-round-icon-32.png', url: '/fr',
      labelfr: 'français', labelen: 'french', labeles: 'francés', labeljp: 'フランス語'
    },
    {
      codelang: 'en', shortlang: 'en', img: '../../../../assets/drapeau/united-kingdom-flag-round-icon-32.png', url: '/en',
      labelfr: 'anglais', labelen: 'english', labeles: 'inglés', labeljp: '英語'
    },
    {
      codelang: 'es', shortlang: 'es', img: '../../../../assets/drapeau/spain-flag-round-icon-32.png', url: '/es',
      labelfr: 'espagnol', labelen: 'spanish', labeles: 'español', labeljp: 'スペイン語'
    },
    {
      codelang: 'jp', shortlang: 'jp', img: '../../../../assets/drapeau/japan-flag-round-icon-32.png', url: '/jp',
      labelfr: 'japonais', labelen: 'japanese', labeles: 'japonés', labeljp: '日本'
    }
  ];

  @Output() ContentViewDefault = new EventEmitter<any>();

  constructor(
    public dialog: MatDialog, public apiClientService: ApiClientService, public route: Router,
    @Inject(LOCALE_ID) private locale: string, private router: Router,
    public decryptTokenService: DecryptTokenService, public selectedLanguageService: SelectedLanguageService, public breakpointObserver: BreakpointObserver,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.breakpointObserver.observe(['(max-width: 1100px)']).subscribe((state: BreakpointState) => this.isTablet = state.matches);

    this.notifications$ = timer(0, 60000).pipe(
      switchMap(() => this.notificationService.getNotifications()),
    );

    this.lang = this.locale;
    if (this.selectedLanguageService.checkLanguageCountry()) {
      this.lang = this.selectedLanguageService.getLanguageCountry();
    }

    this.otherLanguage.forEach(element => {
      if ( element.codelang === this.lang || element.shortlang === this.lang) {
        this.currentLanguage = element.img;
      }
    });

    this.apiClientService
      .get(API_URI_USER + '/' + this.decryptTokenService.userId)
      .subscribe(user => {
        this.user = user;
        this.account = user.customeraccount;
        if (user.customeraccount) {
          this.isProfesionalAccount = user.customeraccount.type === 'profesional';
        }
        switch (user.customeraccount.offer && user.customeraccount.offer.id) {
          case 14:
            this.offer_id = 'Gratuit';
            break;
          case 15:
            this.offer_id = '50 TEST';
            break;
          case 16:
            this.offer_id = '10 TESTS';
            break;
          case 18:
            this.offer_id = 'ENTREPRISE';
            break;
          case 19:
            this.offer_id = 'ENTREPRISE++';
            break;
          default:
            this.offer_id = 'Gratuit';
        }
      }, (err) => {
        console.error(err);
      });

    this.menuBurgeurDropdown();

    const textMenu = document.querySelectorAll('.text-menu');
    textMenu.forEach(element => element.addEventListener('click', (e) => e.preventDefault()));
    // textMenu.forEach(element => {
    //   element.addEventListener('click', function(e) {
    //     e.preventDefault();
    //   });
    // });
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  getCurrentRoute() {
    return this.router.url;
  }

  getProperty(obj: any, property: string): string {
    return obj[property + this.lang];
  }

  setCurrentLanguage(langage) {
    this.selectedLanguageService.updtateLanguageCountry(langage);
    this.currentLanguage = langage.img;
    // window.parent.location.href = window.parent.location.origin + langage.url + window.parent.location.pathname;
    window.parent.location.href = langage.url + this.getCurrentRoute();
    // window.location.reload();
    console.log('window.parent.location : ', window.parent.location.origin + langage.url + window.parent.location.pathname);
    console.log('window.parent.location.href : ', langage.url + this.getCurrentRoute());
  }

  public disConnection(event) {
    event.preventDefault();
    const dialogRef = this.dialog.open(DistConnecTed, {});
  }

  initNotifNotRead(array) {
    this.notifUnread = 0;
    array.forEach(element => {
      if (!element.status) {
        this.notifUnread += 1;
      }
    });
  }

  delete(notificationID: number) {
    this.subscription = this.apiClientService.put(API_URI_NOTIFICATIONS + '/' + notificationID, { status: true }).subscribe();
    this.notifications$ = this.notifications$.pipe(map(notifications => notifications.filter(notif => notif.id !== notificationID)));
  }

  navigateTo(idCampaign, idNotif, value) {
    const updateUrl = API_URI_NOTIFICATIONS + '/' + idNotif;
    if (!value) {
      // this.apiClientService
      //   .put(updateUrl, { status: !value })
      //   .toPromise()
      //   .then(_ => {
      //     this.notifications = this.notifications.filter(notification => {
      //       notification.id == idNotif ? (notification.status = !value) : value;
      //       return notification;
      //     });
      //     this.initNotifNotRead(this.notifications);
      //     this.route.navigate([
      //       '/dashboard/campaigns/' + idCampaign + '/candidats'
      //     ]);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    } else {
      this.route.navigate(['/dashboard/campaigns/' + idCampaign + '/candidats']);
    }
  }

  // public active_menu() {
  //   const totalLeft = document.getElementById('totalLeft');
  //   const btnArrow = document.getElementById('btn-arrow');

  //   // totalLeft.classList.toggle('new-totalLeft');

  //   btnArrow.classList.add('fa-arrow-left');
  //   btnArrow.classList.toggle('fa-arrow-right');

  //   this.ContentViewDefault.emit(
  //     (this.viewcontentDefaults = !this.viewcontentDefaults)
  //   );
  // }

  public Activet_isShow() {
    this.isShow = !this.isShow;
  }

  public activeMenuBurgeur() {
    this.activeMenuB = !this.activeMenuB;
  }

  menuBurgeurDropdown() {
    const list = document.querySelectorAll('.list-menu li');
    list.forEach(element => {});
  }
}

@Component({
  selector: 'distConnected',
  templateUrl: 'distConnected.html'
})
export class DistConnecTed {
  constructor(
    public dialogRef: MatDialogRef<DistConnecTed>,
    public route: Router
  ) {}

  hideDialog(): void {
    this.dialogRef.close();
  }

  public confirmDisConnection() {
    localStorage.removeItem('currentUser');

    this.dialogRef.close();
    this.route.navigate(['/home/register']);
  }
}

// @Component({
//   selector: 'popup-mon-offre',
//   templateUrl: './popup-mon-offre.html',
//   styleUrls: ['./popup-mon-offre.scss']
// })
// export class PopupMonOffre {
//   constructor(private bottomSheetRef: MatBottomSheetRef<PopupMonOffre>) { }

//   openLink(event: MouseEvent): void {
//     this.bottomSheetRef.dismiss();
//     event.preventDefault();
//   }
// }
