import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService : LoginService) { }

  ngOnInit(): void {
  }
  token:any;
  newuser={
    firstname:"",
    lastname: "",
    email :"",
    password:""
  };

  saveUser(userData: any) {
    console.log(userData, 'userdata')

  
    this.newuser.firstname = userData.firstname
    this.newuser.lastname = userData.lastname
    this.newuser.email = userData.email
    this.newuser.password = userData.password
    
    let data = this.newuser
    console.log(data, ' data postés ')

    this.loginService.saveUser(data).subscribe(data => {
      console.log(data, ' posté et data')
      
    })
}

destroy(){
  localStorage.clear();
}

loginUser (userData:any){
  let data = {
    email : "",
    password : ""
  }
  data.email = userData.email
  data.password = userData.password
  console.log(data, ' data update');
  this.loginService.loginUser(data).subscribe((data: any) => {
    this.token = data.token;
    localStorage.setItem('current_user_token', this.token)

  })
      
}

}
