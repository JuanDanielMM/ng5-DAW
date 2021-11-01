import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';
import { DataService } from '../data.service';
import { GraphqlProductsService } from '../graphql.products.service';
import { GraphqlUsersService } from '../graphql.users.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('goals',[
      transition('* =>*',[
        query(':enter',style({ opacity: 0  }), {optional: true}),
        query(':enter', stagger('300ms',[
          animate('.6s ease-in',keyframes([
            style({opacity: 0, transform:'translateY(-75%)', offset:0 }),
            style({opacity: .5, transform:'translateY(35px)', offset:.3 }),
            style({opacity: 1, transform:'translateY(0)', offset:1 }),
          ]))
        ]), {optional: true}),

        query(':leave', stagger('300ms',[
          animate('.6s ease-in',keyframes([
            style({opacity: 1, transform:'translateY(0)', offset:0 }),
            style({opacity: .5, transform:'translateY(35px)', offset:.3 }),
            style({opacity: 0 , transform:'translateY(-75%)', offset:1 }),
          ]))
        ]), {optional: true})


      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  itemCount!: number;
  btnText: string = 'Add an item';
  goalText: string = 'My first goal';
  goals: any[] = [];
  user: string = "";
  pass: string = "";
  token: string = "";

  loading!: boolean;
  private querySubscription!: Subscription;

  constructor(private _data: DataService,
              private graphqlProductsService: GraphqlProductsService,
              private graphqlUsersService: GraphqlUsersService) { }

  ngOnInit(): void {
    /*this._data.goal.subscribe(res => this.goals = res);
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);*/

    this.itemCount = this.goals.length;

    this.querySubscription = this.graphqlProductsService.links("-")
      .valueChanges
      .subscribe(({ data, loading }) => {
        this.loading = loading;
        this.goals = JSON.parse(JSON.stringify(data)).links;
        console.log(JSON.stringify(this.goals))
      });
  }

  addItem() {
    //this.goals.push(this.goalText);

    //var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6ImFkc29mdCIsImV4cCI6MTYzNDc5NTgwMiwib3JpZ0lhdCI6MTYzNDc5NTUwMn0._6tOsFeS7Li59toIpxyD1rDNi_HXnjvcDPBjoKXNcUk"; // profe
    var mytoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6Imp1YW4iLCJleHAiOjE2MzU2MzYxMjcsIm9yaWdJYXQiOjE2MzU2MzU4Mjd9.aZdNyX20Nz2p-wtF86O6AwkcwEKQpOoz-dpk_ATc9RA"; // juan
    //this.storageService.getSession("token");
    alert(this.goalText);

    this.graphqlProductsService.createLink(mytoken, "https://www.github.com", this.goalText)
    .subscribe(({ data }) => {
       console.log('link created :  ', data);
    }, (error) => {
       console.log('there was an error sending the query', error);
    });

    this.goalText = '';
    this.itemCount = this.goals.length;
    this._data.changeGoal(this.goals);
  }

  loginUser() {

    alert(this.user + " - " + this.pass);
    this.graphqlUsersService.tokenAuth(this.user, this.pass)
    .subscribe(({ data }) => {
       console.log('logged: ', JSON.stringify(data));
      // this.storageService.setSession("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      //this.storageService.setLocal("token", JSON.parse(JSON.stringify(data)).tokenAuth.token);
      this.token =  JSON.parse(JSON.stringify(data)).tokenAuth.token;


      //this.loginService.showData(mydata);
      // this.router.navigate(['/']);

    }, (error) => {
       console.log('there was an error sending the query', error);
    });

    //this.user = '';
    this.pass = '';

  }

  removeItem(i) {
    this.goals.splice(i, 1);
    this._data.changeGoal(this.goals);
  }

}
