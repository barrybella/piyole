import { JsService } from './services/js.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'maison-public';

  constructor(private js: JsService, private titleService: Title, private router: Router, private activatedRoute: ActivatedRoute){}
  
  ngOnInit(){
    this.js.jsAppComponent();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.data['title'] || 'Piyole | Immobilier et Construction | Guinée Conakry';
      })
    ).subscribe(title => {
      this.titleService.setTitle(title);
    });
  }
}
