import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {UserService} from '../core/user.service';
import {IUser} from '../shared/interfaces';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../core/alert.service';
import {AuthService} from '../core/auth.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'user-edit',
  templateUrl: 'user-edit.component.html'
})
export class UserEditComponent implements OnInit {

  currentUserInfo: any;

  userForm: FormGroup;

  validationMessages = {
    username: {
      'required': '아이디를 입력해주세요.',
    },
    password: {
      'requiredPassword': '패스워드를 입력해주세요.',
    },
    name: {
      'required': '이름을 입력해주세요.',
    },
    email: {
      'required': '이메일을 입력해주세요.',
    },
    mainPhone: {
      'required': '대표전화를 입력해주세요.',
    },
    userPhone: {
      'required': '담당전화를 입력해주세요.',
    },
    role: {
      'required': '권한을 선택해주세요.',
    },

  };

  formErrors = {
    'username': [],
    'password': [],
    'name': [],
    'email': [],
    'mainPhone': [],
    'userPhone': [],
    'role': []
  };

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserService,
              private authService: AuthService, private alertService: AlertService) {
    this.currentUserInfo = this.authService.getCurrentUserInfo();
    if (!this.currentUserInfo || this.currentUserInfo.role != 'super_admin') {
      this.router.navigate(['/']);
      return;
    }
  }

  ngOnInit(): void {

    this.initFormGroup();
    const id = this.route.snapshot.params['id'];

    if (id != null) {
      this.userService.getUser(id)
        .subscribe((user: IUser) => {

            for (let u in user) {
              let oneUser = this.userForm.controls[u];
              if (oneUser) {
                oneUser.setValue(user[u]);
              }
            }

          },
          (err: any) => {
            if (err.toString().indexOf('No JWT present or') > -1) {
              this.router.navigate(['login']);
            } else {
              this.alertService.error(err);
            }
          }
        );
    }
  }

  onValueChanged(data?: any) {
    if (!this.userForm) {
      return;
    }
    const form = this.userForm;
    for (const field in this.userForm.controls) {
      // clear previous error message
      this.formErrors[field] = [];
      this.userForm[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          // if (messages[key])
          this.formErrors[field].push(messages[key]);
        }
      }
    }
  }

  back() {
    history.back();
  }

  saveUser() {
    this.userService.saveUser(this.userForm.value)
      .subscribe(
        (result: any) => {
          history.back();
        },
        (err: any) => {
          if (err.toString().indexOf('No JWT present or') > -1) {
            this.router.navigate(['login']);
          } else {
            this.alertService.error(err);
          }
        }
      );
  }

  passwordRequired(control: FormControl) {
    let v: string = control.value;
    let check = this.userForm.value._id ? true : false;

    if (check) {
      if (!v)
        return {'passwordRequired': true};
    }
    return null
  }

  private initFormGroup() {
    this.userForm = new FormGroup({
      _id: new FormControl('', Validators.compose([])),
      username: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      password: new FormControl('', Validators.compose([
        // this.passwordRequired,
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      mainPhone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      userPhone: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      role: new FormControl('user', Validators.compose([
        Validators.required,
      ]))
    });

    this.userForm.valueChanges
      .debounceTime(400)
      .subscribe(data => this.onValueChanged(data));
  }

}
